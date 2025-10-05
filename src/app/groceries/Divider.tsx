// components/Divider.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

interface DividerProps {
  onDisappear: () => void;
  src: string;
  initialDelay?: number;
  minRespawnDelay?: number;
  maxRespawnDelay?: number;
  visibleDuration?: number;
}

export default function Divider({
  onDisappear,
  src,
  initialDelay = 2,
  minRespawnDelay = 7,
  maxRespawnDelay = 12,
  visibleDuration = 5,
}: DividerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isInitialRender = useRef(true);

  // 👇 1. Add new state to track the scrolling position
  const [scrollX, setScrollX] = useState(0);
  const animationFrameId = useRef<number>(0);

  // This ref stores the onDisappear callback to prevent timer resets
  const onDisappearRef = useRef(onDisappear);
  useEffect(() => {
    onDisappearRef.current = onDisappear;
  }, [onDisappear]);

  // This useEffect handles the appear/disappear TIMERS
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isVisible) {
      timerId = setTimeout(() => {
        onDisappearRef.current();
        setIsVisible(false);
      }, visibleDuration * 1000);
    } else {
      let delay;
      if (isInitialRender.current) {
        delay = initialDelay * 1000;
        isInitialRender.current = false;
      } else {
        delay =
          (Math.random() * (maxRespawnDelay - minRespawnDelay) +
            minRespawnDelay) *
          1000;
      }
      timerId = setTimeout(() => setIsVisible(true), delay);
    }

    return () => clearTimeout(timerId);
  }, [
    isVisible,
    initialDelay,
    visibleDuration,
    minRespawnDelay,
    maxRespawnDelay,
  ]);

  // 👇 2. Add a new useEffect hook for the scrolling ANIMATION
  useEffect(() => {
    // Only run the animation if the divider is visible
    if (isVisible) {
      // When it first becomes visible, reset its position to the start
      setScrollX(0);

      const animateScroll = () => {
        // Move the item to the left. Adjust '-100' to change the travel distance.
        setScrollX((prevX) => (prevX > -100 ? prevX - 0.1 : -100));
        animationFrameId.current = requestAnimationFrame(animateScroll);
      };
      // Start the animation loop
      animationFrameId.current = requestAnimationFrame(animateScroll);
    }

    // Cleanup function: Stop the animation when the component hides or unmounts
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible]); // This effect runs only when `isVisible` changes

  const style: React.CSSProperties = {
    position: "absolute",
    top: "20%",
    left: "90%", // Starting horizontal position
    transition: "opacity 0.5s ease-in-out",
    opacity: isVisible ? 1 : 0,
    maxHeight: "12.5vw",
    pointerEvents: "none",
    // 👇 3. Apply the scrolling animation via the transform property
    transform: `translateX(${scrollX}vw)`,
  };

  return (
    <div style={style}>
      <img src={src} alt="Scrolling divider" />
    </div>
  );
}
