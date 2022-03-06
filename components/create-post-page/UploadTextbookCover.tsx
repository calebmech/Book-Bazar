import { Box, Button, Icon, VStack } from "@chakra-ui/react";
import ImageUpload from "@components/ImageUpload/ImageUpload";
import { RefreshIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export const TEXTBOOK_ASPECT_RATIO = 4 / 5;

interface Props {
  onCoverPhotoUploaded: (coverPhoto: Blob) => void;
  onClose: VoidFunction;
}

export default function UploadTextbookCover({
  onCoverPhotoUploaded,
  onClose,
}: Props) {
  const newWrapTextbookCoverUploaded = async (blob: Blob) => {
    onCoverPhotoUploaded(blob);
  };

  const [imageUploadKey, setImageUploadKey] = useState("");

  return (
    <ImageUpload
      key={imageUploadKey}
      aspectRatio={4 / 5}
      onCancel={onClose}
      onUpload={newWrapTextbookCoverUploaded}
      shape="rect"
    >
      {({ body, ConfirmationButtons }) => (
        <VStack maxWidth="sm" margin="auto">
          <Box width="full" minHeight="60">
            {body}
          </Box>
          <Box width="full" textAlign="right">
            <ConfirmationButtons
              spacing="5"
              CancelButton={(props) => (
                <Button
                  variant="link"
                  leftIcon={<Icon as={RefreshIcon} />}
                  {...props}
                  onClick={() => setImageUploadKey(uuid())}
                >
                  Retake
                </Button>
              )}
              ConfirmButton={(props) => (
                <Button colorScheme="teal" {...props}>
                  Looks good!
                </Button>
              )}
            />
          </Box>
        </VStack>
      )}
    </ImageUpload>
  );
}
