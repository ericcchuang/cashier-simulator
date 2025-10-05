import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

interface BeltProps {
  beltID: number;
}
export default function Belt({ beltID }: BeltProps) {
  let xPos = beltID * -5;

  const style = {
    maxHeight: "12.5vw",
    right: `${beltID * 25}vw`,
  };

  let bid = "belt".concat(beltID.toString());

  function moveImage() {
    const image = document.getElementById(bid);
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

  moveImage();

  return (
    <div style={style}>
      <img id={bid} src="/assets/conveyor-anim.png" />
    </div>
  );
}
