import { Flex, Heading } from "@chakra-ui/react";
import { Colors, useColor } from "@styles/colors";

export default function Header() {
  return (
    <Flex
      backgroundColor={useColor(Colors.secondaryBackground)}
      padding={4}
      alignItems="center"
      justifyContent="center"
    >
      <Heading as="h1" size="md">
        Book Bazar
      </Heading>
    </Flex>
  );
}
