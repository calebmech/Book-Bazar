import {
  Button,
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  PhotographIcon,
  RefreshIcon,
  UploadIcon,
} from "@heroicons/react/solid";
import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import ImageCrop from "./ImageCrop";

export interface ImageCropModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  shape: "round" | "rect";
  aspectRatio: number;
  onUpload: (image: Blob) => Promise<unknown>;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  shape,
  aspectRatio,
  onUpload,
}: ImageCropModalProps) {
  const [uncroppedImageUrl, setUncroppedImageUrl] = useState<string>();
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "error"
  >("idle");

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const imageBlob = event.target.files?.[0];
    if (imageBlob) {
      handleRawImage(imageBlob);
    }
  };

  const handleImageDrop = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const imageBlob = event.dataTransfer?.files?.[0];
    if (imageBlob) {
      handleRawImage(imageBlob);
    }
  };

  const handleRawImage = (image: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUncroppedImageUrl(reader.result);
      }
    };
  };

  const handleUploadImage = () => {
    if (!croppedImage) return;

    setUploadStatus("uploading");
    onUpload(croppedImage).catch((error) => {
      console.error(error);
      setUploadStatus("error");
    });
  };

  const handleImageCropChange = useCallback(
    (blob: Blob) => setCroppedImage(blob),
    [setCroppedImage]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent pt={5} pb={4}>
        <ModalHeader draggable>Choose image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!uncroppedImageUrl ? (
            <Flex
              onDrop={handleImageDrop}
              onDragOver={(event) => event.preventDefault()}
              py="4"
              height={{ sm: 200 }}
              width="100%"
              align="center"
            >
              <FormControl align="center">
                <Input
                  id="file"
                  display="none"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageSelect(event)}
                />
                <Button
                  role="button"
                  as="label"
                  htmlFor="file"
                  size="lg"
                  leftIcon={<Icon as={PhotographIcon} />}
                >
                  Select image
                </Button>
              </FormControl>
            </Flex>
          ) : (
            <ImageCrop
              shape={shape}
              aspectRatio={aspectRatio}
              imageUrl={uncroppedImageUrl}
              onChange={handleImageCropChange}
            />
          )}
          {uploadStatus === "error" && (
            <Text my="4">
              Something went wrong while uploading your image, please try again.
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          {uploadStatus === "error" ? (
            <Button
              colorScheme="teal"
              onClick={handleUploadImage}
              rightIcon={<Icon as={RefreshIcon} />}
            >
              Try again
            </Button>
          ) : (
            <Button
              disabled={!croppedImage}
              isLoading={uploadStatus === "uploading"}
              colorScheme="teal"
              rightIcon={<Icon as={UploadIcon} />}
              onClick={handleUploadImage}
            >
              Upload
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
