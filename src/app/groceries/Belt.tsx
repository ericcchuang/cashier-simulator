import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Belt({ beltID }) {
  let xPos = 0;

  const style = {
    height: "20vw",
    right: `${beltID * 100}`,
  };

  let bid = "belt".concat(beltID);

  function moveImage() {
    const image = document.getElementById(bid);
    if (xPos > -500) {
      xPos--;
    } else {
      xPos = 0;
      if (image) {
        image.style.transform = `translate(500px, 0px)`;
      }
    }
    // Increment the x-coordinate
    if (image) {
      image.style.transform = `translate(${xPos}px, 0px)`;
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
