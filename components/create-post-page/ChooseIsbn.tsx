import {
  Center,
  VStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Quagga from "@ericblade/quagga2";
import { useCallback } from "react";
import IsbnEntry from "./IsbnEntry";
import ScanBarcode from "./ScanBarcode";
import ScanBarcodeButton from "./ScanBarcodeButton";

interface Props {
  setIsbn: (isbn: string) => void;
}

export default function ChooseIsbn({ setIsbn }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const onNoCamera = useCallback(() => {
    onClose();
    toast({
      title: "No camera detected",
      description:
        "If you don't have a camera, you can type in the ISBN by hand. " +
        "If you do, please make sure you allow Book Bazar to access it.",
      status: "error",
      duration: 10000,
      isClosable: true,
    });
  }, [onClose, toast]);

  return (
    <VStack spacing="10">
      <Center my="4">
        <ScanBarcodeButton onClick={() => onOpen()} />
      </Center>
      <IsbnEntry onIsbnSubmitted={setIsbn} />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          Quagga.stop();
          onClose();
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan barcode</ModalHeader>
          <ModalCloseButton />
          <ModalBody minHeight="sm" pb="8">
            <ScanBarcode onDetected={setIsbn} onNoCamera={onNoCamera} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
