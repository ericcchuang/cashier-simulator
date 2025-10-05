// src/app/api/chat/start/route.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import selectPersonality from "../Personalities";

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

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const personality = selectPersonality(Math.floor(Math.random() * 6));

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: personality,
      safetySettings,
    });

    const chat = model.startChat({ history: [] });

    const result = await chat.sendMessage("A customer approaches. Greet them.");
    const initialMessage = result.response.text();
    const finalHistory = await chat.getHistory();

    // 👇 Also send the chosen personality back to the frontend
    return NextResponse.json({
      initialMessage,
      initialHistory: finalHistory,
      personality,
    });
  } catch (error) {
    console.error("CRITICAL_ERROR in /api/chat/start:", error);
    return NextResponse.json(
      { error: "Failed to start chat session." },
      { status: 500 }
    );
  }
}
