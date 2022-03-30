import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  Flex,
  FormControl,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import {
  PhotographIcon,
  RefreshIcon,
  UploadIcon,
} from "@heroicons/react/solid";
import { handleRawImage } from "@lib/helpers/frontend/handle-raw-image";
import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import ImageCrop from "./ImageCrop";

export interface ImageUploadRenderProps {
  body: React.ReactNode;
  ConfirmationButtons: (
    props: {
      RetryButton?: (props: ButtonProps) => React.ReactElement;
      // This is gross
      CancelButton?: ({
        hasImage,
        ...props
      }: { hasImage: boolean } & ButtonProps) => React.ReactElement;
      ConfirmButton?: (props: ButtonProps) => React.ReactElement;
    } & ButtonGroupProps
  ) => React.ReactElement;
}

export interface ImageUploadProps {
  shape: "round" | "rect";
  aspectRatio: number;
  onCancel: VoidFunction;
  onUpload: (image: Blob) => Promise<unknown>;
  children: (props: ImageUploadRenderProps) => React.ReactChild;
}

export default function ImageUpload({
  shape,
  aspectRatio,
  onCancel,
  onUpload,
  children,
}: ImageUploadProps) {
  const [uncroppedImageUrl, setUncroppedImageUrl] = useState<string | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "error"
  >("idle");

  const handleInitialImage = (image: Blob) => {
    handleRawImage(image, setUncroppedImageUrl);
    setCroppedImage(image);
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const imageBlob = event.target.files?.[0];
    if (imageBlob) {
      handleInitialImage(imageBlob);
    }
  };

  const handleImageDrop = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const imageBlob = event.dataTransfer?.files?.[0];
    if (imageBlob) {
      handleInitialImage(imageBlob);
    }
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
    <>
      {children({
        body: (
          <>
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
                Something went wrong while uploading your image, please try
                again.
              </Text>
            )}
          </>
        ),
        ConfirmationButtons: ({
          CancelButton = (props) => (
            <Button variant="outline" {...props}>
              Cancel
            </Button>
          ),
          RetryButton = (props) => (
            <Button
              colorScheme="teal"
              rightIcon={<Icon as={RefreshIcon} />}
              {...props}
            >
              Try again
            </Button>
          ),
          ConfirmButton = (props) => (
            <Button
              colorScheme="teal"
              rightIcon={<Icon as={UploadIcon} />}
              {...props}
            >
              Upload
            </Button>
          ),
          ...props
        }) => (
          <ButtonGroup {...props}>
            <CancelButton hasImage={Boolean(croppedImage)} onClick={onCancel} />
            {uploadStatus === "error" ? (
              <RetryButton onClick={handleUploadImage} />
            ) : (
              <ConfirmButton
                disabled={!croppedImage}
                isLoading={uploadStatus === "uploading"}
                onClick={handleUploadImage}
              />
            )}
          </ButtonGroup>
        ),
      })}
    </>
  );
}
