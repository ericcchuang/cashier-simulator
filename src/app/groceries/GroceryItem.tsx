import { useDraggable } from "@dnd-kit/core";
import { randomUUID } from "crypto";
import { useState } from "react";

interface GroceryItemProps {
  id: string;
  imgUrl: string;
}

export default function GroceryItem({ id, imgUrl }: GroceryItemProps) {
  let xPos = 0;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};
  const style = { ...transformStyle };

  function moveImage() {
    const image = document.getElementById(id);
    if (xPos > -35) {
      xPos = xPos - 0.2;
    } else {
      xPos = 0;
      if (image) {
        image.style.transform = `translate(60vw, 0px)`;
      }
    }
    // Increment the x-coordinate
    if (image) {
      image.style.transform = `translate(${xPos}vw, 0px)`;
    }
    requestAnimationFrame(moveImage);
  }
  if (!transform) {
    moveImage();
  }

  const className = "align-center w-[10vw]";
  return (
    <input
      type="image"
      src={imgUrl}
      {...listeners}
      {...attributes}
      className={className}
      ref={setNodeRef}
      style={style}
      id={id}
    ></input>
  );
}
