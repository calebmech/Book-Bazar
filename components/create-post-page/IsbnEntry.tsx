import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useBookQuery } from "@lib/hooks/book";
import { PopulatedBook } from "@lib/services/book";
import { FormEvent, useState } from "react";
import BarcodeIcon from "./BarcodeIcon";

interface Props {
  onIsbnSubmitted: (book: PopulatedBook) => void;
}

export default function IsbnEntry({ onIsbnSubmitted }: Props) {
  const [isbn, setIsbn] = useState("");
  const toast = useToast();

  const bookQuery = useBookQuery(isbn);

  const handleFormSubmit = (event: FormEvent) => {
    if (isbn.length > 0 && bookQuery.data) {
      onIsbnSubmitted(bookQuery.data);
    } else {
      toast({
        title: "Book not found",
        description:
          "Unfortunately, that book doesn't appear to be required for any courses. " +
          "Please double check that you've entered the ISBN correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    event.preventDefault();
  };

  return (
    <Box backgroundColor="accent" rounded={10} p={2}>
      <VStack>
        <Icon as={BarcodeIcon} w={100} h={100} color="secondaryBackground" />
        <HStack spacing={4}>
          <form onSubmit={handleFormSubmit}>
            <InputGroup>
              <Input
                backgroundColor="primaryBackground"
                aria-label="isbn"
                onChange={(e) => setIsbn(e.target.value.trim())}
              />
              <InputRightElement width="6.5rem">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={bookQuery.isLoading}
                  colorScheme="teal"
                  isDisabled={isbn.length === 0}
                >
                  Find Book
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
        </HStack>
        <Text as="i" color="secondaryBackground">
          Type ISBN
        </Text>
      </VStack>
    </Box>
  );
}
