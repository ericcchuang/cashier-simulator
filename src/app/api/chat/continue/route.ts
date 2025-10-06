// src/app/api/chat/continue/route.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const { prompt, history, personality } = await request.json();
  if (!prompt || !history || !personality) {
    return NextResponse.json(
      { error: "Prompt, history, and personality are required" },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: personality,
      safetySettings,
    });

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ responseText });
  } catch (error) {
    console.error("Error continuing chat:", error);
    return NextResponse.json(
      { error: "Failed to continue chat. We got rate limited by Gemini :(" },
      { status: 500 }
    );
  }
}
