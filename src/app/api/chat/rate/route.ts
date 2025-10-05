// src/app/api/chat/rate/route.ts
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const { history } = await request.json();
  if (!history || history.length < 3) {
    return NextResponse.json({
      ratingText:
        "-10, Cashier did not attempt to talk. Management noticed on camera.",
      scoreChange: 0,
    });
  }

  try {
    // 👇 1. Format the history into a simple text transcript.
    const conversationTranscript = history
      // We slice(2) to remove the initial two setup/personality messages
      .slice(2)
      .map((entry: Content) => {
        const prefix = entry.role === "model" ? "Cashier:" : "Customer:";
        return `${prefix} ${entry.parts[0].text}`;
      })
      .join("\n");

    // 👇 2. Create a new, more direct prompt that includes the transcript.
    const ratingPrompt = `
      Based *only* on the following conversation transcript, rate the cashier's customer service from -5 to +5.
      Be brief (1-2 sentences), harsh but fair.
      IMPORTANT: Your response MUST start with the score in the format \`+x\` or \`-x\` (e.g., +4, -2). Do not start with any other words or punctuation.

      ---
      TRANSCRIPT:
      ${conversationTranscript}
      ---
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-pro for this kind of analysis task
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // 👇 3. Make a simple, one-off call with the complete prompt.
    const result = await model.generateContent(ratingPrompt);

    const ratingText = result.response.text();
    const scoreChange = parseInt(ratingText.slice(0, 2), 10) || 0;

    return NextResponse.json({ ratingText, scoreChange });
  } catch (error) {
    console.error("Error rating chat:", error);
    return NextResponse.json({ error: "Failed to rate chat" }, { status: 500 });
  }
}
