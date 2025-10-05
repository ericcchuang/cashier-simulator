"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Chat, GoogleGenAI } from "@google/genai";
import "dotenv/config";
import cereal from "../assets/cereal.png";
import GroceryItem from "./groceries/GroceryItem";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useTimer } from "use-timer";
import LossModal from "../components/Lost";
import InstructionsModal from "../components/Instructions";
import RandomPortrait from "../components/RandomPortrait";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Scanner from "./groceries/Scanner";
import Conveyor from "./groceries/Conveyor";
import Belt from "./groceries/Belt";

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
        "You are a very quiet customer who does not want to talk. Use short, curt, one to five word responses, to the point of not communicating what needs to happen. Use punctuation such as elipses to indicate boredom. Give a high rating when prompted at the end since you don't care."
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
  const [customer, setCustomer] = useState(Math.floor(Math.random() * 6));
  const [tint, setTint] = useState(Math.floor(Math.random() * 10));
  const [readInstructions, setReadInstructions] = useState<boolean>(false);
  const { time, start, pause, reset, status, advanceTime } = useTimer({
    initialTime: 20,
    timerType: "DECREMENTAL",
  });

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
    advanceTime(-10);
    start();
  }

  async function newCustomer() {
    const ret = (await rateUser()) + " Next customer is waiting...";
    setVal(ret ?? "");
    setCustomer(Math.floor(Math.random() * 6));
    setTint(Math.floor(Math.random() * 10));
    (document.getElementById("customer_chat") as HTMLFormElement).reset();
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
    advanceTime(-10);
    start();
  }

  async function rateUser() {
    const message = await currentChat.sendMessage({
      message:
        "Rate all previous interactions with the cashier from -5 to +5 based on how good their customer service was. Be brief in your rating, keep it to 1-2 sentences. Be harsh but fair, do not be afraid to give a low score if you think the service was terrible. Make sure the the score is in the format +x or -x and it is the first two characters of the message. Include the leading + or - (for example, +1, -2, etc)",
    });
    setScore(score + parseInt(message.text?.slice(0, 2) ?? "0"));
    return message.text;
  }

  async function resetGame() {
    const ret = "Next customer is waiting...";
    setVal(ret ?? "");
    (document.getElementById("customer_chat") as HTMLFormElement).reset();
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
    reset();
    setScore(0);
  }

  async function iRead() {
    setReadInstructions(true);
  }

  function handleDrop(event: DragEndEvent) {
    if (event.over) {
      const itemId = event.active.id.toString();
      const item = document.getElementById(itemId);

      if (item) {
        console.log(`Disabling and hiding element with id ${itemId}`);

        // 1. Disable the item to prevent interaction
        item.setAttribute("aria-disabled", "true");
        item.style.pointerEvents = "none";

        // 2. Fade the item out (requires a CSS transition)
        item.style.opacity = "0";

        const respawnDelay = Math.random() * 2000 + 1000; // 1s to 3s delay

        setTimeout(() => {
          const itemToRespawn = document.getElementById(itemId);
          if (itemToRespawn) {
            console.log(`Reactivating and showing element with id ${itemId}`);

            // 3. Restore visual appearance
            itemToRespawn.style.transform = "translate(0px, 0px)";
            itemToRespawn.style.opacity = "1";

            // 4. Re-enable the item to restore its logic
            itemToRespawn.removeAttribute("aria-disabled");
            itemToRespawn.style.pointerEvents = "auto";
          }
        }, respawnDelay);
      }
      setScore(score + 1);
    }
  }

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-16"
      style={{
        backgroundImage: `url('/assets/background.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <main className="flex flex-row gap-[32px] row-start-2 items-center sm:items-start">
        <div id="textboxdiv" className="items-center w-sm">
          <RandomPortrait randomImage={customer} randomFilter={tint} />
          <div className="my-3 p-3 bg-black min-h-1/2 max-h-1/2 border-2 border-white">
            {val}
          </div>
          <form
            className="flex justify-center"
            onSubmit={handleSubmit}
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
            <button
              type="button"
              className="border-2 border-white bg-black p-2"
              onClick={newCustomer}
            >
              New
            </button>
          </form>
          <p className="my-3 p-3 bg-black border-2 border-white text-6xl">
            Score: {score} Time: {time}
          </p>
        </div>
        <div
          className="max-w-3/5 min-w-1/2 mt-15"
          style={{ position: "fixed", right: 0 }}
        >
          <DndContext id="dnd-context" onDragEnd={handleDrop}>
            <div
              className="flex flex-row justify-center align-middle items-center"
              style={{ position: "relative" }}
            >
              <Scanner />
              <Conveyor />
              <Belt beltID={0} />
              <Belt beltID={1} />
              <Belt beltID={2} />
              <Belt beltID={3} />
              <Belt beltID={4} />
              <Belt beltID={5} />
              <Belt beltID={6} />
              <Belt beltID={7} />

              <div style={{ position: "absolute" }}>
                <GroceryItem id="0" item={0} index={0} />
                <GroceryItem id="1" item={1} index={1} />
                <GroceryItem id="2" item={2} index={2} />
                <GroceryItem id="3" item={3} index={3} />
                <GroceryItem id="4" item={4} index={4} />
                <GroceryItem id="5" item={5} index={5} />
                <GroceryItem id="6" item={6} index={6} />
                <GroceryItem id="7" item={7} index={7} />
                <GroceryItem id="8" item={8} index={8} />
                <GroceryItem id="9" item={9} index={9} />
              </div>
            </div>
          </DndContext>
        </div>
        {!readInstructions ? <InstructionsModal disableScript={iRead} /> : ""}
        {time < 1 ? <LossModal replayScript={resetGame} score={score} /> : ""}
      </main>
    </div>
  );
}
