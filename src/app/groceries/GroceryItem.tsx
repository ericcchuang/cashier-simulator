import { useDraggable } from "@dnd-kit/core";
import { randomUUID } from "crypto";
import { useState } from "react";

interface GroceryItemProps {
  id: string;
  item: number;
}

export default function GroceryItem({ id, item }: GroceryItemProps) {
  let imgUrl = "";
  switch (item) {
    case 0:
      imgUrl = "/assets/bleach.png";
      break;
    case 1:
      imgUrl = "/assets/cereal.png";
      break;
    case 2:
      imgUrl = "/assets/essential.png";
      break;
    case 3:
      imgUrl = "/assets/gum.png";
      break;
    case 4:
      imgUrl = "/assets/mlk.png";
      break;
    case 5:
      imgUrl = "/assets/pnut.png";
      break;
    case 6:
      imgUrl = "/assets/rootbeer.png";
      break;
    case 7:
      imgUrl = "/assets/soap.png";
      break;
    case 8:
      imgUrl = "/assets/steak.png";
      break;
    case 9:
      imgUrl = "/assets/tueothpaste.png";
      break;
  }

  const image = document.getElementById(id);
  let xPos = 0;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  let transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};
  let style = {
    ...transformStyle,
    right: -25,
    zIndex: 99,
  };

  function moveImage() {
    console.log(isDragging);
    if (!isDragging) {
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
    } else {
      transformStyle = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : {};
      style = {
        ...transformStyle,
        right: -25,
        zIndex: 99,
      };
      if (image && transformStyle.transform) {
        image.style.transform = transformStyle.transform;
        image.style.zIndex = style.zIndex;
      }
      requestAnimationFrame(moveImage);
    }
  }

  moveImage();

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
