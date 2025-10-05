import React from "react";

interface InstructionsModalProps {
  disableScript: () => void;
}

export default function InstructionsModal({
  disableScript,
}: InstructionsModalProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100/75">
      <div className="bg-white rounded-md overflow-hidden max-w-md w-full mx-4">
        <nav className="bg-black text-white flex justify-between px-4 py-2">
          <span className="text-lg">Welcome to Cashier Simulator!</span>
        </nav>
        <div className="py-4 pl-4 text-black">
          <p className="text-2xl font-bold">How to Play!</p>
          <p>
            Drag items into the scanner to scan the items for points. Don't let
            items build up or you will lose points! Talk to the customer and try
            to provide good customer service. The customer will grade you and
            give or remove points accordingly. Buy time by making small talk
            with the customer. Try not to run out of time or you will lose!
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-500 transition duration-150
      text-white px-5 py-2 m-2 rounded-md"
          onClick={disableScript}
        >
          Play!
        </button>
      </div>
    </div>
  );
}
