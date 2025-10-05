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
import Divider from "./groceries/Divider";

interface FormElements extends HTMLFormControlsCollection {
  textbox: HTMLInputElement;
}

interface MyElement extends HTMLFormElement {
  readonly elements: FormElements;
}
// Define the structure of a chat history item
interface HistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [val, setVal] = useState("Customer is waiting...");
  const [score, setScore] = useState(0);
  const [customer, setCustomer] = useState(Math.floor(Math.random() * 6));
  const [tint, setTint] = useState(Math.floor(Math.random() * 10));
  const [readInstructions, setReadInstructions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { time, start, pause, reset, status, advanceTime } = useTimer({
    initialTime: 20,
    timerType: "DECREMENTAL",
  });
  const [personality, setPersonality] = useState("");

  // This useEffect hook runs once on component mount to start the first game
  useEffect(() => {
    resetGame();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const prompt = (form.elements.namedItem("textbox") as HTMLInputElement)
      .value;
    if (!prompt) return;

    setIsLoading(true);

    const currentHistory = Array.isArray(history) ? history : [];
    const newHistory: HistoryItem[] = [
      ...currentHistory,
      { role: "user", parts: [{ text: prompt }] },
    ];
    setHistory(newHistory);

    try {
      const response = await fetch("/api/chat/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 👇 Send the current personality along with the prompt and history
        body: JSON.stringify({ prompt, history: newHistory, personality }),
      });
      const data = await response.json();

      if (response.ok) {
        setVal(data.responseText);
        setHistory([
          ...newHistory,
          { role: "model", parts: [{ text: data.responseText }] },
        ]);
      } else {
        setVal(`Error: ${data.error}`);
      }
    } catch (error) {
      setVal("Error: Could not connect to the server.");
    } finally {
      form.reset();
      setIsLoading(false);
    }
  }

  async function newCustomer() {
    setIsLoading(true);
    try {
      // 1. Rate the previous user first
      const rateResponse = await fetch("/api/chat/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });
      const rateData = await rateResponse.json();

      if (rateResponse.ok) {
        setScore((prevScore) => prevScore + rateData.scoreChange);
        setVal(`${rateData.ratingText} Next customer is waiting...`);
      } else {
        setVal(`Rating Error: ${rateData.error}. Next customer is waiting...`);
      }

      // 2. Start a new chat session for the new customer
      const startResponse = await fetch("/api/chat/start", { method: "POST" });
      const startData = await startResponse.json();

      if (startResponse.ok) {
        setHistory(startData.initialHistory);
        // Optionally, update val again if you want the greeting to be the last message seen
        // setVal(startData.initialMessage);
      } else {
        setVal(`Error: ${startData.error}`);
      }
    } catch (error) {
      setVal("Error: Could not connect to the server.");
    } finally {
      setCustomer(Math.floor(Math.random() * 6));
      setTint(Math.floor(Math.random() * 10));
      setIsLoading(false);
    }
  }

  async function resetGame() {
    setIsLoading(true);
    reset();
    start();
    setScore(0);
    try {
      const response = await fetch("/api/chat/start", { method: "POST" });
      const data = await response.json();

      if (response.ok && Array.isArray(data.initialHistory)) {
        // 👇 Store the new personality received from the backend
        setPersonality(data.personality);
        setVal(data.initialMessage);
        setHistory(data.initialHistory);
      } else {
        setVal(`Error: Failed to initialize game.`);
        setHistory([]);
      }
    } catch (error) {
      setVal("Error: Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  async function iRead() {
    setReadInstructions(true);
    start();
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
            {/*<button
              type="button"
              className="border-2 border-white bg-black p-2"
              onClick={newCustomer}
            >
              New
            </button>*/}
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
              <Divider
                src="/assets/divider.png"
                onDisappear={newCustomer}
                initialDelay={5}
              />
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
