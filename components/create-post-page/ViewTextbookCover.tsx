import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { UploadIcon } from "@heroicons/react/outline";
import { useState } from "react";

interface Props {
  onOpen: VoidFunction;
  coverPhoto: Blob | null;
}

export default function ViewTextbookCover({ onOpen, coverPhoto }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleRawImage = (image: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
  };

  if (coverPhoto) {
    handleRawImage(coverPhoto);
  }

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
