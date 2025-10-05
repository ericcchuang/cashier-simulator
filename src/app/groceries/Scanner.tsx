import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Scanner() {
  const { isOver, setNodeRef } = useDroppable({
    id: "grocery-scanner",
  });
  const style = {
    filter: isOver
      ? "invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)"
      : undefined,
    width: "40vw",
  };
  // if (isOver) {
  //   console.log("over!!!");
  // }

  return (
    <div ref={setNodeRef} style={style}>
      <img style={style} src="/assets/scanner.png" />
    </div>
  );
}
