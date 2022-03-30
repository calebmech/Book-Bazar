import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { PencilAltIcon, UploadIcon } from "@heroicons/react/outline";
import { TEXTBOOK_ASPECT_RATIO } from "./UploadTextbookCover";

interface Props {
  onOpen: VoidFunction;
  imageUrl: string | null;
}

export default function ViewTextbookCover({ onOpen, imageUrl }: Props) {
  return (
    <Flex
      direction="column"
      align={"center"}
      gap={1}
      onClick={onOpen}
      cursor={"pointer"}
    >
      {imageUrl ? (
        <Box
          position="relative"
          height={250}
          width={250 * TEXTBOOK_ASPECT_RATIO}
          borderRadius="lg"
          overflow="hidden"
          _hover={{ opacity: "0.7" }}
        >
          <Image layout="fill" src={imageUrl} alt="book-image" />
        </Box>
      ) : (
        <Icon
          as={UploadIcon}
          viewBox="0 75 2316 1608"
          width="10em"
          height="10em"
          color="accent"
          _hover={{ opacity: "0.7" }}
        />
      )}
      <Button
        mt="1"
        size="sm"
        // width={{ base: "initial", md: "full" }}
        width="full"
        leftIcon={<Icon as={PencilAltIcon} />}
      >
        Edit image
      </Button>
    </Flex>
  );
}
