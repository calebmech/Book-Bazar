import { Button, ButtonProps, Icon, Text, VStack } from "@chakra-ui/react";
import { CameraIcon } from "@heroicons/react/outline";

export default function ScanBarcodeButton({ ...props }: ButtonProps) {
  return (
    <>
      <Button
        py="6"
        px="12"
        colorScheme="teal"
        height="auto"
        borderRadius="lg"
        size="lg"
        boxShadow="base"
        {...props}
      >
        <VStack>
          <Icon
            sx={{ path: { strokeWidth: "1.5 !important" } }}
            as={CameraIcon}
            w={14}
            h="auto"
            mb="1"
          />
          <Text>Scan Barcode</Text>
        </VStack>
      </Button>
    </>
  );
}
