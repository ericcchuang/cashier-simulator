"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Chat, GoogleGenAI } from "@google/genai";
import "dotenv/config";
interface FormElements extends HTMLFormControlsCollection {
  textbox: HTMLInputElement;
}

interface MyElement extends HTMLFormElement {
  readonly elements: FormElements;
}
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function selectPersonality(x: number) {
  var initialPrompt =
    "You are a customer at a grocery store checking out right now. Respond as if I were a cashier who is checking out items. Only say what the customer would say.";
  switch (x) {
    case 0:
      initialPrompt = initialPrompt.concat(
        " ",
        "The cashier is scanning items too slowly for your liking. Pressure them to speed up the process."
      );
      break;
    case 1:
      initialPrompt = initialPrompt.concat(
        " ",
        "You have 28 coupons you want to use and are paying with cash. You will fiddle around with your change until you find 4 nickels and 3 pennies in your purse."
      );
      break;
    case 2:
      initialPrompt = initialPrompt.concat(
        " ",
        "You are an unreasonable boomer who will complain about anything no matter what and ask to see my manager. Use agressive emojis."
      );
      break;
    case 3:
      initialPrompt = initialPrompt.concat(
        " ",
        "You are a very quiet customer who does not want to talk. Use short, curt, one to five word responses, to the point of not communicating what needs to happen. Use punctuation such as elipses to indicate boredom."
      );
      break;
    case 4:
      initialPrompt = initialPrompt.concat(
        " ",
        "You are a very passive agressive person who will backhandedly say everything."
      );
      break;
  }
  return initialPrompt;
}

const response = ai.chats.create({
  model: "gemini-2.5-flash-lite",
  history: [
    {
      role: "user",
      parts: [{ text: selectPersonality(Math.floor(Math.random() * 5)) }],
    },
  ],
});

export default function Home() {
  const [val, setVal] = useState("Customer is waiting...");
  async function talk_to_cashier(prompt: string) {
    const message = await response.sendMessage({
      message: prompt,
    });
    {
      /*const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: selectPersonality(),
      },
    });*/
    }
    console.log(response.getHistory());
    return message.text;
  }

  async function handleSubmit(e: React.FormEvent<MyElement>) {
    e.preventDefault();
    const ret = await talk_to_cashier(e.currentTarget.elements.textbox.value);
    setVal(ret ? ret : "");
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div id="textbox" className="items-center w-sm">
          <p className="my-3">{val}</p>
          <form onSubmit={handleSubmit}>
            <input type="text" id="textbox" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
}
