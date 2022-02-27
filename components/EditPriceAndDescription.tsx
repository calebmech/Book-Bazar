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

export interface EditPriceAndDescriptionProps {
  description: string | null;
  price: number | null;
  campusStorePrice: number | null;
  onPriceChange: (price: string) => void;
  onDescriptionChange: (description: string) => void;
}

export default function EditPriceAndDescription({
  description,
  price,
  campusStorePrice,
  onPriceChange,
  onDescriptionChange,
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
          onChange={(e) => onDescriptionChange(e.target.value)}
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
            onChange={(e) => onPriceChange(e.target.value.trim())}
            value={price || ""}
          />
        </InputGroup>
      </Box>

      {/* Row 3 */}
      <Box>{/* empty */}</Box>

      <Box paddingBottom={2}>
        <Text color="captionText" textAlign="right">
          {campusStorePrice
            ? `Sold new for $${(campusStorePrice / 100).toFixed(2)}`
            : "Not available from the campus store"}
        </Text>
      </Box>
    </SimpleGrid>
  );
}
