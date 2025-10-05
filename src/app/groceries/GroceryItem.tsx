import { useDraggable } from "@dnd-kit/core";
import { randomUUID } from "crypto";
import { useState } from "react";

interface GroceryItemProps {
  id: string;
  imgUrl: string;
}

export default function GroceryItem({ id, imgUrl }: GroceryItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div ref={setNodeRef}>
      <button {...listeners} {...attributes}>
        <img src={imgUrl} />
        Drag handle
      </button>
    </div>
  );
}
