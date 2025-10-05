// components/GroceryItem.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { useState, useEffect, useRef, CSSProperties } from "react";

// Cleaner way to map items to image URLs
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
  index: number; // Pass the item's index for a staggered effect
}

export default function GroceryItem({ id, item, index }: GroceryItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [idleXPos, setIdleXPos] = useState(0); // State for idle animation position
  const animationFrameId = useRef<number>(0);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  // Effect for staggered visibility
  useEffect(() => {
    const delay = index * 300; // 300ms delay per item
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer); // Cleanup
  }, [index]);

  // Effect for idle animation
  useEffect(() => {
    const moveImage = () => {
      setIdleXPos((prevX) => (prevX > -85 ? prevX - 0.2 : -85));
      animationFrameId.current = requestAnimationFrame(moveImage);
    };

    // Start animation only if visible AND not dragging
    if (isVisible && !isDragging) {
      animationFrameId.current = requestAnimationFrame(moveImage);
    }

    // Cleanup function stops the animation
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible, isDragging]); // Dependency array now includes isVisible

  // Conditionally determine the transform style
  const style: CSSProperties = {
    position: "absolute",
    right: "-30vw",
    top: "-12vw",
    opacity: isVisible ? 1 : 0, // Control visibility
    transition: "opacity 0.5s ease-in-out", // Smooth fade-in
    zIndex: isDragging ? 99 : 10,
    scale: "25%",
    transform: isDragging
      ? `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)` // Dragging transform
      : `translate3d(${idleXPos}vw, 0px, 0)`, // Idle animation transform
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
