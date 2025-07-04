// src/app/api/chat/route.ts
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  Tool,
  SchemaType,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { parseAllGroupsData, ParsedBerlitzData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";

let cachedParsedData: ParsedBerlitzData[] | null = null;

function getParsedData(): ParsedBerlitzData[] {
  if (cachedParsedData) {
    return cachedParsedData;
  }
  console.log("Parsing data for the first time and caching...");
  cachedParsedData = parseAllGroupsData(rawBerlitzGroups);
  return cachedParsedData;
}

const API_KEY = process.env.GOOGLE_API_KEY;
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

if (!API_KEY || !SYSTEM_PROMPT) {
  throw new Error(
    "GOOGLE_API_KEY and SYSTEM_PROMPT must be set in environment variables."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "handleOffTopicUser",
        description:
          "Ends the conversation when a user persistently goes off-topic after a warning.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            finalMessage: {
              type: SchemaType.STRING,
              description:
                "A final, polite message to display to the user before ending the chat.",
            },
          },
          required: ["finalMessage"],
        },
      },
    ],
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
  tools: tools,
});

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// --- FIX: This function now accepts ALL data to build a global student directory ---
function createComprehensiveContext(
  currentGroupData: ParsedBerlitzData,
  allData: ParsedBerlitzData[]
): string {
  // --- PART 1: Full, detailed report for the CURRENTLY SELECTED group ---
  let context = `
<full_group_report_data for="${currentGroupData.metadata.groupName}">
  <group_metadata>
    Group Name: ${currentGroupData.metadata.groupName}
    Course Name: ${currentGroupData.metadata.name}
    Course Level: ${currentGroupData.metadata.level}
    Minimum Attendance to Pass: ${currentGroupData.metadata.attendanceMin}
    Session Duration: ${currentGroupData.metadata.duration}
    Session Frequency: ${currentGroupData.metadata.frequency}
    Additional Info: ${
      currentGroupData.metadata.additionalInfo.join(", ") || "N/A"
    }
  </group_metadata>
  <student_specific_attendance>
`;

  currentGroupData.metadata.studentNames.forEach((student) => {
    const studentRecords = currentGroupData.attendance.filter(
      (rec) => rec.student === student
    );
    const onTime = studentRecords.filter((r) => r.status === "On-time").length;
    const late = studentRecords.filter((r) => r.status === "Late").length;
    const absent = studentRecords.filter((r) => r.status === "Absent").length;
    const totalMinutesLate = studentRecords.reduce(
      (sum, rec) => sum + rec.minutesLate,
      0
    );
    context += `    <student name="${student}">
      On-time: ${onTime}, Late: ${late}, Absent: ${absent}, Total Minutes Late: ${totalMinutesLate}
    </student>
`;
  });

  context += `  </student_specific_attendance>
  <full_progress_log_avance>
`;
  currentGroupData.progress.forEach((note) => {
    context += `    <progress_update day="${note.day}" date="${note.date}">${note.note}</progress_update>\n`;
  });
  context += `  </full_progress_log_avance>
</full_group_report_data>
`;

  // --- PART 2: A directory of ALL students across ALL groups ---
  // This gives the AI global awareness to answer questions like "Which group is Gustavo in?"
  context += `
<global_student_directory>
  This is a list of all students and the group(s) they belong to. Use this to find a student if they are not in the currently selected group's report.
`;
  const studentMap = new Map<string, string[]>();
  allData.forEach((group) => {
    group.metadata.studentNames.forEach((student) => {
      if (!studentMap.has(student)) {
        studentMap.set(student, []);
      }
      studentMap.get(student)?.push(group.metadata.groupName);
    });
  });

  studentMap.forEach((groups, student) => {
    context += `  <student name="${student}" groups="${groups.join(
      ", "
    )}" />\n`;
  });

  context += `</global_student_directory>
`;

  return context;
}

export async function POST(req: Request) {
  try {
    const { question, groupId, recap } = await req.json();

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    const allParsedData = getParsedData();
    const currentGroupData = allParsedData.find(
      (group) => group.groupName === groupId
    );

    if (!currentGroupData) {
      return NextResponse.json(
        { error: `Group not found: ${groupId}` },
        { status: 404 }
      );
    }

    // --- FIX: Call the new context function with ALL data ---
    const fullContext = createComprehensiveContext(
      currentGroupData,
      allParsedData
    );

    const finalPrompt = `
${
  recap
    ? `<recap_of_previous_conversation>${recap}</recap_of_previous_conversation>`
    : ""
}

<knowledge_base>
${fullContext}
</knowledge_base>

Based *only* on the data within the <knowledge_base> tag, answer the user's question. If the user asks about a student not in the primary report, use the <global_student_directory> to find them and provide their information, clearly stating which group they are in.

User Question: "${question}"
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      safetySettings,
    });

    const response = result.response;
    const responseContent = response.candidates?.[0]?.content;

    if (responseContent?.parts[0]?.functionCall) {
      const functionCall = responseContent.parts[0].functionCall;
      if (functionCall.name === "handleOffTopicUser") {
        const args = functionCall.args as { finalMessage: string };
        return NextResponse.json({
          blocked: true,
          message:
            args.finalMessage ||
            "This conversation has been ended due to off-topic questions.",
        });
      }
    }

    const text = response.text();
    return NextResponse.json({ answer: text });
  } catch (error: unknown) {
    console.error("API Error:", error);
    let errorMessage = "Failed to process your request.";
    if (error instanceof Error) {
      errorMessage = `An error occurred: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
