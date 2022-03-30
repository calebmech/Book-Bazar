import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import EditPriceAndDescription from "@components/EditPriceAndDescription";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { getFloatStringPriceAsNumber } from "@lib/helpers/priceHelpers";
import { PopulatedBook } from "@lib/services/book";
import { FormEvent, useEffect, useState } from "react";
import BookPreviewCard from "./BookPreviewCard";

interface Props {
  book: PopulatedBook;
  coverPhoto: Blob;
  onSubmitPressed: (description: string, price: number) => void;
  onRetakePhoto: () => void;
  isLoading: boolean;
}

export default function SetPriceAndDescription({
  book,
  coverPhoto,
  onSubmitPressed,
  onRetakePhoto,
  isLoading,
}: Props) {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [valid, setValid] = useState(false);

  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  useEffect(() => {
    const reader = new FileReader();

    reader.readAsDataURL(coverPhoto);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverPhotoUrl(reader.result);
      }
    };
  }, [coverPhoto, setCoverPhotoUrl]);

  const handleSubmit = (event: FormEvent) => {
    if (price) {
      onSubmitPressed(description, price);
    }
    event.preventDefault();
  };

  const handlePriceChange = (price: string) => {
    const newPrice = getFloatStringPriceAsNumber(price);
    if (newPrice === null) {
      setValid(false);
    } else {
      setPrice(newPrice);
      setValid(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box maxWidth="sm" margin="auto">
        <Box mb="8">
          <BookPreviewCard book={book} alternativeImage={coverPhotoUrl} />
        </Box>

        <EditPriceAndDescription
          description={description}
          price={price}
          campusStorePrice={book.campusStorePrice}
          onPriceChange={handlePriceChange}
          onDescriptionChange={(description) => setDescription(description)}
        />

        <HStack spacing={5} justifyContent="flex-end" width="100%" mt="8">
          <Button
            variant="link"
            onClick={() => onRetakePhoto()}
            leftIcon={<Icon as={ArrowLeftIcon} />}
          >
            Retake photo
          </Button>
          <Button
            type="submit"
            colorScheme="teal"
            isDisabled={!valid}
            isLoading={isLoading}
          >
            Post textbook
          </Button>
        </HStack>
      </Box>
    </form>
  );
}
