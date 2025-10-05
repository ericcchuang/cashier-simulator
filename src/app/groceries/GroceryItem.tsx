"use client";

import { useDraggable } from "@dnd-kit/core";
import { useState, useEffect, useRef, CSSProperties } from "react";

const groceryImageUrls = [
  "/assets/bleach.png",
  "/assets/cereal.png",
  "/assets/essential.png",
  "/assets/gum.png",
  "/assets/mlk.png",
  "/assets/pnut.png",
  "/assets/rootbeer.png",
  "/assets/soap.png",
  "/assets/steak.png",
  "/assets/tueothpaste.png",
];

interface GroceryItemProps {
  id: string;
  item: number;
  index: number;
}

export default function GroceryItem({ id, item, index }: GroceryItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [idleRightOffset, setIdleRightOffset] = useState(0);
  const animationFrameId = useRef<number>(0);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const prevIsDragging = useRef(isDragging);

  useEffect(() => {
    const delay = index * 300;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (prevIsDragging.current && !isDragging) {
      setIdleRightOffset(0);
    }
    prevIsDragging.current = isDragging;

    const moveImage = () => {
      setIdleRightOffset((prevOffset) =>
        // speed
        prevOffset < 45 ? prevOffset + 0.1 : 45
      );
      animationFrameId.current = requestAnimationFrame(moveImage);
    };

    if (isVisible && !isDragging) {
      animationFrameId.current = requestAnimationFrame(moveImage);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible, isDragging]);

  const style: CSSProperties = {
    position: "absolute",
    right: `${-50 + idleRightOffset}vw`,
    top: "-12vw",
    opacity: isVisible ? 1 : 0,
    zIndex: isDragging ? 99 : 10,
    scale: "25%",
    transition: isDragging ? "none" : "opacity 0.5s ease-in-out",

    transform: isDragging
      ? `translate3d(${(transform?.x ?? 0) * 4}px, ${
          (transform?.y ?? 0) * 4
        }px, 0)`
      : "none",
  };

  return (
    <input
      id={id}
      type="image"
      src={groceryImageUrls[item] || ""}
      ref={setNodeRef}
      style={style}
      className="align-center scale-70"
      {...listeners}
      {...attributes}
    />
  );
}
