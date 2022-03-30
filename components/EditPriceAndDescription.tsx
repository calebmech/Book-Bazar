import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  getSuggestedUsedPrice,
  formatIntPrice,
} from "@lib/helpers/priceHelpers";

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
    <VStack align="start" spacing={4} width="full">
      <FormControl>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          id="description"
          backgroundColor="secondaryBackground"
          placeholder="Describe the condition of the book"
          value={description ?? ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="price">Asking Price</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="fieldDecoration">
            $
          </InputLeftElement>
          <Input
            id="price"
            backgroundColor="secondaryBackground"
            placeholder={getSuggestedUsedPrice(campusStorePrice ?? undefined)}
            value={price ?? ""}
            onChange={(e) => onPriceChange(e.target.value.trim())}
            type="number"
          ></Input>
        </InputGroup>
        {campusStorePrice && (
          <FormHelperText>
            Sold new for ${formatIntPrice(campusStorePrice)}
          </FormHelperText>
        )}
      </FormControl>
    </VStack>
  );
}
