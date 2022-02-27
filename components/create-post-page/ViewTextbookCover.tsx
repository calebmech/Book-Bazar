import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { UploadIcon } from "@heroicons/react/outline";

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
          height="20rem"
          width="16rem"
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
        colorScheme={"teal"}
        leftIcon={
          <Icon
            as={UploadIcon}
            viewBox="0 75 2316 1608"
            color="secondaryBackground"
          />
        }
      >
        Upload New Photo
      </Button>
    </Flex>
  );
}
