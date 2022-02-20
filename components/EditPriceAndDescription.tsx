import {
  Box,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { PostWithBookWithUser } from "@lib/services/post";

export interface EditPriceAndDescriptionProps {
  description: string | null;
  handlePriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  post: PostWithBookWithUser;
}

export default function EditPriceAndDescription({
  description,
  handlePriceChange,
  handleDescriptionChange,
  post,
}: EditPriceAndDescriptionProps) {
  return (
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
          value={description || ""}
          id="description"
          backgroundColor="secondaryBackground"
          onChange={(e) => handleDescriptionChange(e)}
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
            type="number"
            backgroundColor="secondaryBackground"
            onChange={(e) => handlePriceChange(e)}
            placeholder={(post.price / 100).toFixed(2)}
          />
        </InputGroup>
      </Box>

      {/* Row 3 */}
      <Box>{/* empty */}</Box>
      <Box>
        <Flex direction="column">
          <SimpleGrid columns={2} paddingBottom={3}>
            <Text color="captionText" textAlign="left">
              {`Original asking of $${post.price / 100}`}
            </Text>{" "}
            <Text color="captionText" textAlign="right">
              {post.book.campusStorePrice
                ? `Sold new for $${post.book.campusStorePrice / 100}`
                : "Not available from the campus store"}
            </Text>
          </SimpleGrid>
        </Flex>
      </Box>
    </SimpleGrid>
  );
}
