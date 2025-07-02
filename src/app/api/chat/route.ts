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

// --- CACHING IMPLEMENTATION ---
// This simple in-memory cache will hold the parsed data.
// In a serverless environment, this cache will persist for the "warm" lifetime of the function instance.
let cachedParsedData: ParsedBerlitzData[] | null = null;

/**
 * Gets the parsed Berlitz data, using a cache to avoid re-parsing on every request.
 * @returns {ParsedBerlitzData[]} The array of all parsed group data.
 */
function getParsedData(): ParsedBerlitzData[] {
  if (cachedParsedData) {
    // If cache exists, return it immediately.
    console.log("Returning cached data.");
    return cachedParsedData;
  } else {
    // If no cache, parse the raw data, store it in the cache, and then return it.
    console.log("Parsing data for the first time and caching...");
    const parsedData = parseAllGroupsData(rawBerlitzGroups);
    cachedParsedData = parsedData;
    return parsedData;
  }
}
// --- END OF CACHING IMPLEMENTATION ---

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

/**
 * Creates a comprehensive, structured report of a group's data to be used as context for the AI.
 * @param {ParsedBerlitzData} parsedData - The parsed data for a single group.
 * @returns {string} A formatted string containing the full context.
 */
function createFullGroupContext(parsedData: ParsedBerlitzData): string {
  let context = `
<group_metadata>
  Group Name: ${parsedData.metadata.groupName}
  Course Name: ${parsedData.metadata.name}
  Course Level: ${parsedData.metadata.level}
  Minimum Attendance to Pass: ${parsedData.metadata.attendanceMin}
  Session Duration: ${parsedData.metadata.duration}
  Session Frequency: ${parsedData.metadata.frequency}
  Additional Info: ${parsedData.metadata.additionalInfo.join(", ") || "N/A"}
</group_metadata>

<overall_attendance_summary>
  Total Sessions Tracked: ${parsedData.metadata.allDays.length}
  Total On-time Records: ${
    parsedData.attendance.filter((r) => r.status === "On-time").length
  }
  Total Late Records: ${
    parsedData.attendance.filter((r) => r.status === "Late").length
  }
  Total Absent Records: ${
    parsedData.attendance.filter((r) => r.status === "Absent").length
  }
</overall_attendance_summary>

<student_specific_attendance>
`;

  parsedData.metadata.studentNames.forEach((student) => {
    const studentRecords = parsedData.attendance.filter(
      (rec) => rec.student === student
    );
    const onTime = studentRecords.filter((r) => r.status === "On-time").length;
    const late = studentRecords.filter((r) => r.status === "Late").length;
    const absent = studentRecords.filter((r) => r.status === "Absent").length;
    const totalMinutesLate = studentRecords.reduce(
      (sum, rec) => sum + rec.minutesLate,
      0
    );

    context += `  <student name="${student}">
    On-time: ${onTime} sessions
    Late: ${late} sessions
    Absent: ${absent} sessions
    Total Minutes Late: ${totalMinutesLate}
  </student>
`;
  });

  context += `</student_specific_attendance>

<full_progress_log_avance>
`;

  parsedData.progress.forEach((note) => {
    context += `  <progress_update day="${note.day}" date="${note.date}">
    ${note.note}
  </progress_update>
`;
  });

  context += `</full_progress_log_avance>
`;

  return context;
}

export async function POST(req: Request) {
  try {
    const { question, groupId, recap } = await req.json();

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required for AI queries." },
        { status: 400 }
      );
    }

    // --- USE CACHED DATA ---
    const allParsedData = getParsedData();
    const currentGroupData = allParsedData.find(
      (group) => group.groupName === groupId
    );

    if (!currentGroupData) {
      return NextResponse.json(
        { error: `No data found for group: ${groupId}` },
        { status: 404 }
      );
    }

    const fullContext = createFullGroupContext(currentGroupData);

    const finalPrompt = `
${
  recap
    ? `<recap_of_previous_conversation>${recap}</recap_of_previous_conversation>`
    : ""
}

<full_group_report_data for="${currentGroupData.groupName}">
${fullContext}
</full_group_report_data>

Based *only* on the data above, answer the following user question.

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
            "This conversation has been ended due to off-topic questions. Please try again in 24 hours.",
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
