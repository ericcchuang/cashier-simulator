// src/app/groceries/Belt.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

// 👇 1. Update the prop type to expect a number for the ID
interface BeltProps {
  id: number;
}

export default function Belt({ id }: BeltProps) {
  const [xPos, setXPos] = useState(id * -5);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameId = useRef<number>(0);

  // 👇 2. Create the formatted ID string
  const beltId = `belt${id}`;

  useEffect(() => {
    const moveImage = () => {
      setXPos((prevX) => (prevX > -35 ? prevX - 0.2 : 0));
      animationFrameId.current = requestAnimationFrame(moveImage);
    };

    animationFrameId.current = requestAnimationFrame(moveImage);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const style = {
    transform: `translateX(${xPos}vw)`,
  };

  return (
    <div>
      <img
        // 👇 3. Use the new formatted ID
        id={beltId}
        ref={imageRef}
        src="/assets/conveyor-anim.png"
        style={style}
        alt="Conveyor belt divider"
      />
    </div>
  );
}
