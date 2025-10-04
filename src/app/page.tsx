'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'
interface FormElements extends HTMLFormControlsCollection {
  textbox: HTMLInputElement
}

interface MyElement extends HTMLFormElement {
  readonly elements: FormElements
}
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function Home() {
  const [val, setVal] = useState("Customer is waiting...");
  async function main(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a customer at a grocery store checking out right now. Respond as if I were a cashier who is checking out items too slowly. Do not use parenthesis or dashes, only say what the customer would say.",
      },
    });
    return response.text;
  }
  async function handleSubmit(e: React.FormEvent<MyElement>) {
    e.preventDefault();
    const ret = await main(e.currentTarget.elements.textbox.value);
    setVal(ret ? ret : "");
  };
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="textbox"
          />
          <button type="submit">Submit</button>
        </form>
        <p>{val}</p>
      </main>
    </div>
  );
}
