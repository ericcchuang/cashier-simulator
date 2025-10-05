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
  const [scrollX, setScrollX] = useState(0);
  const animationFrameId = useRef<number>(0);

  const onDisappearRef = useRef(onDisappear);
  useEffect(() => {
    onDisappearRef.current = onDisappear;
  }, [onDisappear]);

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

  useEffect(() => {
    if (isVisible) {
      setScrollX(0); // Reset position
      const animateScroll = () => {
        // Match the GroceryItem's 45vw travel distance
        setScrollX((prevX) => (prevX > -45 ? prevX - 0.1 : -45));
        animationFrameId.current = requestAnimationFrame(animateScroll);
      };
      animationFrameId.current = requestAnimationFrame(animateScroll);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible]);

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: "0%",
    left: "100%",
    height: "20vw",
    width: "auto",
    opacity: isVisible ? 1 : 0,
    transform: `translateX(${scrollX}vw)`,
    transition: "opacity 0.5s ease-in-out",
    pointerEvents: "none",
  };

  return <img src={src} style={imageStyle} alt="Scrolling divider" />;
}
