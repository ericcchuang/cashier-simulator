import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Conveyor() {
  const { isOver, setNodeRef } = useDroppable({
    id: "conveyer",
  });
  const style = {
    color: isOver ? "green" : undefined,
    width: "50vw",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <img src="/assets/conveyor.png" />
    </div>
  );
}
