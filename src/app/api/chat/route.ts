// src/app/api/chat/route.ts
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  Tool,
  SchemaType, // FIX 1: Import the SchemaType enum
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { parseAllGroupsData, ParsedBerlitzData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";

const API_KEY = process.env.GOOGLE_API_KEY;
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

if (!API_KEY || !SYSTEM_PROMPT) {
  throw new Error(
    "GOOGLE_API_KEY and SYSTEM_PROMPT must be set in environment variables."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Define the tool for handling off-topic users
const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "handleOffTopicUser",
        description:
          "Ends the conversation when a user persistently goes off-topic after a warning.",
        parameters: {
          // FIX 2: Use the SchemaType enum instead of strings
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

function getRelevantContext(
  question: string,
  parsedData: ParsedBerlitzData
): string {
  let context = `Course Name: ${parsedData.metadata.name} ${parsedData.metadata.level} (Group: ${parsedData.groupName})\n`;
  context += `Minimum Attendance to Pass: ${parsedData.metadata.attendanceMin}\n`;
  const lowerCaseQuestion = question.toLowerCase();

  if (lowerCaseQuestion.includes("student")) {
    context += `Student Names: ${parsedData.metadata.studentNames.join(
      ", "
    )}\n`;
  }
  if (lowerCaseQuestion.includes("progress")) {
    context += `--- Recent Progress Notes ---\n`;
    parsedData.progress.slice(-5).forEach((p) => {
      context += `- ${p.day}: ${p.note}\n`;
    });
  }
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

    const context = getRelevantContext(question, currentGroupData);

    const finalPrompt = `
${
  recap
    ? `<recap_of_previous_conversation>${recap}</recap_of_previous_conversation>`
    : ""
}

<data_context for="${currentGroupData.groupName}">
${context}
</data_context>

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
