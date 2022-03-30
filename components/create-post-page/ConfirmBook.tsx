import { Button, HStack, Icon, VStack } from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { PopulatedBook } from "@lib/services/book";
import BookPreviewCard from "./BookPreviewCard";

interface Props {
  book: PopulatedBook;
  onClickYes: () => void;
  onClickNo: () => void;
}

export default function ConfirmBook({ book, onClickYes, onClickNo }: Props) {
  return (
    <VStack maxWidth="md" margin="auto" spacing="8">
      <BookPreviewCard book={book} />
      <HStack spacing={5} justifyContent="flex-end" width="100%">
        <Button
          onClick={onClickNo}
          variant="link"
          leftIcon={<Icon as={ArrowLeftIcon} />}
        >
          Try again
        </Button>
        <Button colorScheme="teal" onClick={onClickYes}>
          That&rsquo;s it!
        </Button>
      </HStack>
    </VStack>
  );
}
