import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { IMAGE_UPLOAD_WIDTH } from "@lib/helpers/constants";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";

export interface ImageCropProps {
  shape: "round" | "rect";
  aspectRatio: number;
  imageUrl: string;
  onChange: (image: Blob) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function ImageCrop({
  shape,
  aspectRatio,
  imageUrl,
  onChange,
}: ImageCropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<Area>();

  const handleCropComplete = (_: Area, croppedArea: Area) => {
    setCropArea(croppedArea);
  };

  useEffect(() => {
    console.log("CHANGE");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!cropArea || !canvas || !ctx) return;

    const image = new Image();

    image.onload = () => {
      canvas.width = Math.min(cropArea.width, IMAGE_UPLOAD_WIDTH);
      canvas.height = Math.round(canvas.width * (1 / aspectRatio));
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => blob && onChange(blob), "image/jpeg");
    };

    image.src = imageUrl;
  }, [cropArea, imageUrl, aspectRatio, onChange]);

  return (
    <div>
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        showGrid={false}
        aspect={aspectRatio}
        cropShape={shape}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
        style={{
          containerStyle: {
            width: "100%",
            height: "400px",
            position: "relative",
          },
        }}
      />
      <Slider
        size="lg"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.01}
        value={zoom}
        onChange={(newZoom) => setZoom(newZoom)}
        mt={5}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </div>
  );
}
