import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { getFloatStringPriceAsNumber } from "@lib/helpers/priceHelpers";
import { PopulatedBook } from "@lib/services/book";
import { ChangeEvent, FormEvent, useState } from "react";
import BookCard from "../BookCard";

interface Props {
  book: PopulatedBook;
  onSubmitPressed: (description: string, price: number) => void;
  isLoading: boolean;
}

export default function SetPriceAndDescription({
  book,
  onSubmitPressed,
  isLoading,
}: Props) {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [valid, setValid] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    onSubmitPressed(description, price);
    event.preventDefault();
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = getFloatStringPriceAsNumber(e.target.value.trim());
    if (newPrice === null) {
      setValid(false);
    } else {
      setPrice(newPrice);
      setValid(true);
    }
  };

  return (
    <FormControl>
      <form onSubmit={handleSubmit}>
        <VStack spacing={7}>
          <BookCard book={book} isLinkActive={false} width="140px" />
          <SimpleGrid
            columns={2}
            spacing={3}
            templateColumns="1fr 4fr"
            alignItems="center"
          >
            {/* Row 1 */}
            <Box>
              <FormLabel htmlFor="description">Description:</FormLabel>
            </Box>
            <Box>
              <Textarea
                id="description"
                backgroundColor="secondaryBackground"
                placeholder="Describe the condition of the book"
                onChange={(e) => setDescription(e.target.value.trim())}
              />
            </Box>

            {/* Row 2 */}
            <Box>
              <FormLabel htmlFor="price">Asking Price:</FormLabel>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="fieldDecoration">
                  $
                </InputLeftElement>
                <Input
                  id="price"
                  backgroundColor="secondaryBackground"
                  placeholder="Price"
                  onChange={(e) => handlePriceChange(e)}
                  type="number"
                ></Input>
              </InputGroup>
            </Box>

            {/* Row 3 */}
            <Box>{/* empty */}</Box>
            <Box>
              <Flex direction="column">
                <Box paddingBottom={2}>
                  <Text color="captionText" textAlign="right">
                    {book.campusStorePrice
                      ? `Sold new for $${book.campusStorePrice / 100}`
                      : "Not available from the campus store"}
                  </Text>
                </Box>
                <Flex direction="row">
                  <Spacer />
                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="sm"
                    isDisabled={!valid}
                    isLoading={isLoading}
                  >
                    Create Textbook Post
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </SimpleGrid>
        </VStack>
      </form>
    </FormControl>
  );
}
