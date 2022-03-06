import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Spacer,
  Tag,
  TagLeftIcon,
  Text,
  Textarea,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { AcademicCapIcon, ArrowLeftIcon } from "@heroicons/react/solid";
import { resolveBookTitle } from "@lib/helpers/frontend/resolve-book-data";
import {
  formatIntPrice,
  getFloatStringPriceAsNumber,
} from "@lib/helpers/priceHelpers";
import { PopulatedBook } from "@lib/services/book";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BookCard from "../BookCard";

interface Props {
  book: PopulatedBook;
  coverPhoto: Blob;
  onSubmitPressed: (description: string, price: number) => void;
  isLoading: boolean;
}

export default function SetPriceAndDescription({
  book,
  coverPhoto,
  onSubmitPressed,
  isLoading,
}: Props) {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
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
    <form onSubmit={handleSubmit}>
      <Box maxWidth="sm" margin="auto">
        {/* <BookCard book={book} isLinkActive={false} /> */}
        <Box
          width="100%"
          height="32"
          shadow="md"
          borderRadius="lg"
          overflow="hidden"
          background="secondaryBackground"
          pr="4"
          mb="8"
        >
          <HStack height="100%" spacing="4">
            <Image src={coverPhotoUrl} alt="" height="100%" />
            <VStack
              align="start"
              height="100%"
              py="4"
              pr="4"
              justifyContent="space-between"
            >
              <Box>
                <Text fontWeight="semibold">{resolveBookTitle(book)}</Text>
                <Text color="secondaryText" fontSize="sm">
                  {book.googleBook?.authors?.join(", ")}
                </Text>
              </Box>
              <Wrap>
                {book.courses.map((course) => (
                  <Tag
                    key={course.id}
                    size="sm"
                    variant="solid"
                    colorScheme="teal"
                  >
                    <TagLeftIcon as={AcademicCapIcon} />
                    {course.dept.abbreviation + " " + course.code}
                  </Tag>
                ))}
              </Wrap>
            </VStack>
          </HStack>
        </Box>

        <VStack align="start" spacing={4}>
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              backgroundColor="secondaryBackground"
              placeholder="Describe the condition of the book"
              onChange={(e) => setDescription(e.target.value.trim())}
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
                placeholder={(
                  Math.round(((book.campusStorePrice ?? 5000) / 1000) * 0.6) *
                  10
                ).toFixed(2)}
                onChange={(e) => handlePriceChange(e)}
                type="number"
              ></Input>
            </InputGroup>
            {book.campusStorePrice && (
              <FormHelperText>
                Sold new for ${formatIntPrice(book.campusStorePrice)}
              </FormHelperText>
            )}
          </FormControl>
        </VStack>

        <HStack spacing={5} justifyContent="flex-end" width="100%" mt="8">
          <Button
            variant="link"
            onClick={() => {}}
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
