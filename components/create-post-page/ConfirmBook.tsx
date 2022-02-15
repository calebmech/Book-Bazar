import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { PopulatedBook } from "@lib/services/book";
import BookCard from "../BookCard";

interface Props {
  book: PopulatedBook;
  onClickYes: () => void;
  onClickNo: () => void;
}

export default function ConfirmBook({ book, onClickYes, onClickNo }: Props) {
  return (
    <VStack spacing={3}>
      <Box width="128px">
        <BookCard book={book} isLinkActive={false} />
      </Box>
      <HStack spacing={7}>
        <Button colorScheme="red" onClick={onClickNo}>
          No
        </Button>
        <Button colorScheme="teal" onClick={onClickYes}>
          Yes
        </Button>
      </HStack>
    </VStack>
  );
}
