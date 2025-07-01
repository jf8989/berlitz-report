/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/chat/route.ts
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import {
  parseAllGroupsData,
  ParsedBerlitzData,
  AttendanceRecord,
  ProgressRecord,
} from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData"; // Import ALL raw data

// Initialize Google Generative AI
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  // In a production environment, you might want a more robust error message or
  // to simply return an error response without crashing the server.
  throw new Error(
    "GOOGLE_API_KEY is not set in environment variables. Please add it to your .env.local file."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);
// Use 'gemini-pro' for text-only interactions. 'gemini-1.5-flash' or 'gemini-1.5-pro' if you want newer models
// and if your free tier supports them. 'gemini-pro' is a safe starting point.
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Safety settings to allow more nuanced responses for an educational context,
// but always review these carefully based on your application's needs.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// This function performs a basic Retrieval Augmented Generation (RAG) by
// extracting relevant data from the parsed dataset based on keywords in the question.
function getRelevantContext(
  question: string,
  parsedData: ParsedBerlitzData
): string {
  let context = `Course Name: ${parsedData.metadata.name} ${parsedData.metadata.level} (Group: ${parsedData.groupName})\n`;
  context += `Minimum Attendance to Pass: ${parsedData.metadata.attendanceMin}\n`;
  context += `Class Duration: ${parsedData.metadata.duration}\n`;
  context += `Class Frequency: ${parsedData.metadata.frequency}\n`;
  if (parsedData.metadata.materialsLink !== "N/A") {
    context += `Materials Link: ${parsedData.metadata.materialsLink}\n`;
  }
  if (parsedData.metadata.additionalInfo.length > 0) {
    context += `Additional Course Info: ${parsedData.metadata.additionalInfo.join(
      ", "
    )}\n`;
  }
  context += "\n";

  const lowerCaseQuestion = question.toLowerCase();

  // 1. Context for specific students if mentioned
  parsedData.metadata.studentNames.forEach((student) => {
    if (lowerCaseQuestion.includes(student.toLowerCase())) {
      const studentRecords = parsedData.attendance.filter(
        (rec) => rec.student === student
      );
      if (studentRecords.length > 0) {
        context += `--- Attendance Records for ${student} (Group: ${parsedData.groupName}) ---\n`;
        // Limit context to recent or most relevant records if many, for now, all
        studentRecords.forEach((rec) => {
          context += `- ${rec.day} (${rec.date}): ${rec.status} ${
            rec.minutesLate > 0 ? `(${rec.minutesLate} min late)` : ""
          }\n`;
        });
        context += "\n";
      }
    }
  });

  // 2. Context for specific dates if mentioned
  parsedData.metadata.allDays.forEach((dayInfo) => {
    const lowerCaseDate = dayInfo.date.toLowerCase();
    const lowerCaseDay = dayInfo.day.toLowerCase();
    // Improved date matching: check for exact date, or day name, or parts of date (month/day)
    if (
      lowerCaseQuestion.includes(lowerCaseDate) ||
      lowerCaseQuestion.includes(lowerCaseDay) ||
      (lowerCaseQuestion.includes(dayInfo.date.split("/")[0]) &&
        lowerCaseQuestion.includes(dayInfo.date.split("/")[1]) &&
        lowerCaseQuestion.includes(dayInfo.date.split("/")[2]))
    ) {
      const attendanceOnDate = parsedData.attendance.filter(
        (rec) => rec.date === dayInfo.date
      );
      if (attendanceOnDate.length > 0) {
        context += `--- Details for ${dayInfo.day} (${dayInfo.date}) in Group ${parsedData.groupName} ---\n`;
        attendanceOnDate.forEach((rec) => {
          context += `- ${rec.student}: ${rec.status} ${
            rec.minutesLate > 0 ? `(${rec.minutesLate} min late)` : ""
          }\n`;
        });
        context += "\n";
      }
      const progressOnDate = parsedData.progress.find(
        (rec) => rec.date === dayInfo.date
      );
      if (progressOnDate) {
        context += `Progress note for ${dayInfo.day} (${dayInfo.date}) in Group ${parsedData.groupName}: ${progressOnDate.note}\n\n`;
      }
    }
  });

  // 3. Overall attendance or progress context if general keywords are present
  if (
    lowerCaseQuestion.includes("overall attendance") ||
    lowerCaseQuestion.includes("total classes") ||
    lowerCaseQuestion.includes("class attendance") ||
    lowerCaseQuestion.includes("attendance summary")
  ) {
    const presentCount = parsedData.attendance.filter(
      (rec) => rec.status === "On-time"
    ).length;
    const absentCount = parsedData.attendance.filter(
      (rec) => rec.status === "Absent"
    ).length;
    const lateCount = parsedData.attendance.filter(
      (rec) => rec.status === "Late"
    ).length;
    const totalMinutesLate = parsedData.attendance.reduce(
      (sum, rec) => sum + rec.minutesLate,
      0
    );

    context += `--- Overall Attendance Summary for Group ${parsedData.groupName} ---\n`;
    context += `- Total attendance instances recorded (student-days): ${parsedData.attendance.length}\n`;
    context += `- Total On-time (instances): ${presentCount}\n`;
    context += `- Total Absent (instances): ${absentCount}\n`;
    context += `- Total Late (instances): ${lateCount}\n`;
    context += `- Total Cumulative Lateness: ${totalMinutesLate} minutes\n\n`;
  }

  if (
    lowerCaseQuestion.includes("progress") ||
    lowerCaseQuestion.includes("unit") ||
    lowerCaseQuestion.includes("avance") ||
    lowerCaseQuestion.includes("units covered") ||
    lowerCaseQuestion.includes("notes")
  ) {
    context += `--- All Unit Progress Notes for Group ${parsedData.groupName} ---\n`;
    // Limit to a reasonable number of recent progress notes if very long to prevent exceeding context window
    const notesToShow = parsedData.progress.slice(-15); // Show last 15 notes
    notesToShow.forEach((rec) => {
      context += `- ${rec.day} (${rec.date}): ${rec.note}\n`;
    });
    if (parsedData.progress.length > 15) {
      context += `... (and ${
        parsedData.progress.length - 15
      } older notes not shown for brevity)\n`;
    }
    context += "\n";
  }

  return context;
}

export async function POST(req: Request) {
  try {
    const { question, groupId } = await req.json(); // Receive groupId from the client

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required for AI queries." },
        { status: 400 }
      );
    }

    // Parse all data and find the specific group's data
    const allParsedData = parseAllGroupsData(rawBerlitzGroups);
    const currentGroupData = allParsedData.find(
      (group) => group.groupName === groupId
    );

    if (!currentGroupData) {
      return NextResponse.json(
        { error: `No data found for group: ${groupId}` },
        { status: 404 }
      );
    }

    // Retrieve relevant context based on the user's question and specific group data
    const context = getRelevantContext(question, currentGroupData);

    const prompt = `You are an AI assistant specialized in analyzing Berlitz class data for the group "${currentGroupData.groupName}".
    Based on the provided data, answer the user's question concisely and accurately.
    If the information is not directly available in the provided context for THIS specific group, state that you cannot find it.
    Avoid making up information. Focus only on the provided group's data unless asked about general course policies that apply to all.

    Data Context for "${currentGroupData.groupName}":
    ${context}

    User Question: "${question}"

    Your Answer:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error("API Error:", error);
    let errorMessage = "Failed to process your request. Please try again.";
    if (error instanceof Error) {
      errorMessage = `An error occurred: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
