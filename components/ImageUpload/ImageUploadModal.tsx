import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import ImageUpload, { ImageUploadProps } from "./ImageUpload";

export type ImageUploadModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
} & Omit<ImageUploadProps, "children" | "onCancel">;

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  ...props
}: ImageUploadModalProps) {
  return (
    <ImageUpload
      onCancel={onClose}
      onUpload={async (image) => onUpload(image).then(() => onClose())}
      {...props}
    >
      {({ body, ConfirmationButtons }) => (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent pt={5} pb={4}>
            <ModalHeader>Choose image</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{body}</ModalBody>
            <ModalFooter>
              <ConfirmationButtons />
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </ImageUpload>
  );
}
