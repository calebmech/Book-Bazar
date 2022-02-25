import { SetStateAction } from "react";

export const handleRawImage = (
  image: Blob,
  callback: (value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = () => {
    if (typeof reader.result === "string") {
      callback(reader.result);
    }
  };
};
