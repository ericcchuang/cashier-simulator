import React from "react";
import Image from "next/image";
import { PixelsImage } from "react-pixels";

interface RandomPortraitProps {
  randomImage: number;
  randomFilter: number;
}

export default function randomPortrait({
  randomImage,
  randomFilter,
}: RandomPortraitProps) {
  let imageSource = "";
  switch (randomImage) {
    case 0:
      imageSource = "/assets/customer1.png";
      break;
    case 1:
      imageSource = "/assets/customer2.png";
      break;
    case 2:
      imageSource = "/assets/customer3.png";
      break;
    case 3:
      imageSource = "/assets/customer4.png";
      break;
    case 4:
      imageSource = "/assets/customer5.png";
      break;
    case 5:
      imageSource = "/assets/customer6.png";
      break;
  }

  let filter = "";
  switch (randomFilter) {
    case 0:
      filter = "invert";
      break;
    case 1:
      filter = "mellow";
      break;
    case 2:
      filter = "solange_grey";
      break;
    case 3:
      filter = "";
      break;
    case 4:
      filter = "offset_blue";
      break;
    case 5:
      filter = "sunset";
      break;
    case 6:
      filter = "ryo";
      break;
    case 7:
      filter = "serenity";
      break;
    case 8:
      filter = "aeon";
      break;
    case 9:
      filter = "radio";
      break;
  }

  console.log(filter);

  return (
    <PixelsImage
      src={imageSource}
      filter={filter}
      className="border-4 border-black"
      style={{ width: 200, height: 200 }}
    />
  );
}
