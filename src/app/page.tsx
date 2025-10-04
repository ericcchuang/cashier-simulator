"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Chat, GoogleGenAI } from "@google/genai";
import "dotenv/config";
import backgroundImage from "../assets/background.jpg";
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
    "You are a customer at a grocery store checking out right now. Respond as if I were a cashier who is checking out items. Only say what the customer would say. Keep the response to 1-3 sentence as though it was a human conversation.";
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

const baseChat = ai.chats.create({
  model: "gemini-2.5-flash-lite",
  history: [
    {
      role: "user",
      parts: [{ text: selectPersonality(Math.floor(Math.random() * 5)) }],
    },
  ],
});

export default function Home() {
  const [currentChat, setCurrentChat] = useState<Chat>(baseChat);
  const [val, setVal] = useState("Customer is waiting...");
  const [score, setScore] = useState(0);

  async function talk_to_cashier(prompt: string) {
    const message = await currentChat.sendMessage({
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
    console.log(currentChat.getHistory());
    return message.text;
  }

  async function handleSubmit(e: React.FormEvent<MyElement>) {
    e.preventDefault();
    const ret = await talk_to_cashier(e.currentTarget.elements.textbox.value);
    setVal(ret ?? "");
    (document.getElementById("customer_chat") as HTMLFormElement).reset();
  }

  async function newCustomer() {
    const ret = await rateUser();
    setVal(ret ?? "");
    setCurrentChat(
      ai.chats.create({
        model: "gemini-2.5-flash-lite",
        history: [
          {
            role: "user",
            parts: [{ text: selectPersonality(Math.floor(Math.random() * 5)) }],
          },
        ],
      })
    );
  }

  async function rateUser() {
    const message = await currentChat.sendMessage({
      message:
        "Rate all previous interactions with the user from 1-10 based on how good their customer service was. Be brief in your rating, keep it to 1-2 sentences. Be harsh, do not be afraid to give a low score if you think the service was terrible. Make sure the the score is in the format xx/10 and it is the first two characters of the message. Include the leading 0 (for example, 01, 02, etc)",
    });
    setScore(score + parseInt(message.text?.slice(0, 2) ?? "0"));
    return message.text;
  }

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div id="textboxdiv" className="items-center w-sm">
          <p className="my-3 p-3 bg-black">{val}</p>
          <form
            className="flex justify-center"
            onSubmit={handleSubmit}
            onReset={newCustomer}
            id="customer_chat"
          >
            <input
              type="text"
              id="textbox"
              placeholder="talk to customer"
              className="bg-black border-2 border-white mx-3 p-2"
            />
            <button
              type="submit"
              className="border-2 border-white bg-black mx-3 p-2"
            >
              Submit
            </button>
            <button type="reset" className="border-2 border-white bg-black p-2">
              New
            </button>
          </form>
          <p className="my-3 p-3 bg-black">Score: {score}</p>
        </div>
      </main>
    </div>
  );
}
