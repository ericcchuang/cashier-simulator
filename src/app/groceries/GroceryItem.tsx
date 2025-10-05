import { useDraggable } from "@dnd-kit/core";
import { randomUUID } from "crypto";
import { useState } from "react";

interface GroceryItemProps {
  id: string;
  imgUrl: string;
  className?: string;
}

export default function GroceryItem({
  id,
  imgUrl,
  className,
}: GroceryItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const classConsts = "align-center";
  return (
    <input
      type="image"
      src={imgUrl}
      {...listeners}
      {...attributes}
      className={className?.concat(classConsts) ?? classConsts}
      ref={setNodeRef}
      style={style}
    ></input>
  );
}
