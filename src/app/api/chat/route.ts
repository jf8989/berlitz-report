/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/chat/route.ts

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  Tool,
  SchemaType,
  Part,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { parseAllGroupsData, ParsedBerlitzData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";
import { handoverReport } from "@/data/handoverReport";

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

// --- NEW: Added the displayTheBASFImage tool ---
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
      {
        name: "displayTheBASFImage",
        description:
          "Displays the special collage picture of the BASF Lv7 group when a user confirms they want to see it.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {}, // No parameters needed
        },
      },
    ],
  },
];

const model = genAI.getGenerativeModel({
  // --- FIX: Corrected model name ---
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

function createComprehensiveContext(
  currentGroupData: ParsedBerlitzData,
  allData: ParsedBerlitzData[]
): string {
  // This function remains the same
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
    </student>\n`;
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
    const { question, groupId, history } = await req.json();

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

    const fullContext = createComprehensiveContext(
      currentGroupData,
      allParsedData
    );

    const chat = model.startChat({
      history: history || [],
    });

    const initialPrompt = `
<knowledge_base>
${fullContext}
</knowledge_base>

<handover_report>
${handoverReport}
</handover_report>

User Question: "${question}"
`;

    const result = await chat.sendMessage(initialPrompt);
    const response = result.response;

    // --- REVISED LOGIC: This section now correctly handles tool calls. ---
    const functionCall =
      response.candidates?.[0]?.content?.parts[0]?.functionCall;

    if (functionCall) {
      console.log(`AI is attempting to call tool: ${functionCall.name}`);
      if (functionCall.name === "handleOffTopicUser") {
        const args = functionCall.args as { finalMessage: string };
        return NextResponse.json({
          blocked: true,
          message:
            args.finalMessage ||
            "This conversation has been ended due to off-topic questions.",
        });
      }

      if (functionCall.name === "displayTheBASFImage") {
        // If the AI calls this tool, we don't need to talk to it further.
        // We directly return the special code that the frontend will use to show the image.
        return NextResponse.json({ answer: "%%DISPLAY_IMAGE_BASF7%%" });
      }

      // Handle unknown tools
      throw new Error(`Unknown tool called: ${functionCall.name}`);
    } else {
      // If there was no function call, just return the AI's text response.
      const text = response.text();
      return NextResponse.json({ answer: text });
    }
  } catch (error: unknown) {
    console.error("API Error:", error);
    let errorMessage = "Failed to process your request.";
    if (error instanceof Error) {
      errorMessage = `An error occurred: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
