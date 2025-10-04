import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello there",
        config: {
            systemInstruction: "You are a cat. Your name is Neko.",
        },
    });
    console.log(response.text);
}

await main();