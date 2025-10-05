"use client";

import React, { useState, useEffect, useRef } from "react";

interface BeltProps {
  id: number;
}

export default function Belt({ id }: BeltProps) {
  const [xPos, setXPos] = useState(id * -5);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameId = useRef<number>(0);

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
        id={beltId}
        ref={imageRef}
        src="/assets/conveyor-anim.png"
        style={style}
        alt="Conveyor belt divider"
      />
    </div>
  );
}
