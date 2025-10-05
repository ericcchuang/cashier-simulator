import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Scanner() {
  const { isOver, setNodeRef } = useDroppable({
    id: "grocery-scanner",
  });
  const style = {
    color: isOver ? "green" : undefined,
    width: "40vw",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <img src="/assets/scanner.png" />
    </div>
  );
}
