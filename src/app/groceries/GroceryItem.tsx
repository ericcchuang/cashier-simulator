import { useDraggable } from "@dnd-kit/core";
import { randomUUID } from "crypto";
import { useState } from "react";

interface GroceryItemProps {
  id: string;
  imgUrl: string;
}

export default function GroceryItem({ id, imgUrl }: GroceryItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const className = "align-center w-3/5";
  return (
    <input
      type="image"
      src={imgUrl}
      {...listeners}
      {...attributes}
      className={className}
      ref={setNodeRef}
      style={style}
      role="button"
    ></input>
  );
}
