import { SetStateAction } from "react";

export const handleRawImage = (
  image: Blob,
  setImageUrl: (value: SetStateAction<string | null>) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = () => {
    if (typeof reader.result === "string") {
      setImageUrl(reader.result);
    }
  };
};
