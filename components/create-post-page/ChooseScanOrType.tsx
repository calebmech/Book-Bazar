import { Center, VStack } from "@chakra-ui/react";
import { PopulatedBook } from "@lib/services/book";
import IsbnEntry from "./IsbnEntry";
import ScanBarcodeButton from "./ScanBarcodeButton";

interface Props {
  onScanSelected: () => void;
  onIsbnTyped: (book: PopulatedBook) => void;
}

export default function ChooseScanOrType({
  onScanSelected,
  onIsbnTyped,
}: Props) {
  return (
    <VStack spacing={10}>
      <Center>
        <ScanBarcodeButton onClick={onScanSelected} />
      </Center>
      <IsbnEntry onIsbnSubmitted={onIsbnTyped} />
    </VStack>
  );
}
