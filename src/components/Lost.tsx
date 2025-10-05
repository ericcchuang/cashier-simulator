import React from "react";

export default function LossModal({ replayScript }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-70">
      <div className="bg-white rounded-md overflow-hidden max-w-md w-full mx-4">
        <nav className="bg-black text-white flex justify-between px-4 py-2">
          <span className="text-lg">You Lost :(</span>
        </nav>
        <div className="text-2xl font-bold py-4 pl-4 text-black">
          Time ran out! The customer called your manager.
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-500 transition duration-150
      text-white px-5 py-2 m-2 rounded-md"
          onClick={replayScript}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
