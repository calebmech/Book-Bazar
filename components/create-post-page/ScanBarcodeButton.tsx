import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import { CameraIcon } from "@heroicons/react/outline";

interface Props {
  onClick: () => void;
}

export default function ScanBarcodeButton({ onClick }: Props) {
  return (
    <Box
      as="button"
      transition="all 0.2 cubic-bezier(0.08, 0.52, 0.52, 1)"
      onClick={onClick}
      backgroundColor="accent"
      rounded={10}
      p={4}
      _hover={{ backgroundColor: "accentHover" }}
    >
      <VStack>
        <Icon as={CameraIcon} w={100} h={100} color="secondaryBackground" />
        <Text as="i" color="secondaryBackground">
          Scan Barcode
        </Text>
      </VStack>
    </Box>
  );
}
