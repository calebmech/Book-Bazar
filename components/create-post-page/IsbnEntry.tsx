import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";

interface Props {
  onIsbnSubmitted: (isbn: string) => void;
}

export default function IsbnEntry({ onIsbnSubmitted }: Props) {
  const [isbn, setIsbn] = useState("");

  const handleFormSubmit = (event: FormEvent) => {
    onIsbnSubmitted(isbn);
    event.preventDefault();
  };

  return (
    <VStack width="100%" maxWidth="xs">
      <form onSubmit={handleFormSubmit} style={{ width: "100%" }}>
        <FormControl>
          <FormLabel
            textAlign="center"
            htmlFor="isbn"
            color="secondaryText"
            mb="3"
          >
            or select book by ISBN...
          </FormLabel>
          <InputGroup>
            <Input
              id="isbn"
              name="isbn"
              placeholder="e.g. 9780321573513"
              variant="filled"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
            />
            <InputRightElement width="auto">
              <Button
                type="submit"
                size="sm"
                mr="1"
                colorScheme="teal"
                isDisabled={isbn.length === 0}
              >
                Find Book
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </VStack>
  );
}
