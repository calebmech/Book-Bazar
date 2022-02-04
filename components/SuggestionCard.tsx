import {
  Text,
  Container,
  Heading,
  HStack,
  Stack,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { useBookQuery } from "@lib/hooks/book";
import { CourseWithDept } from "@lib/services/course";
import { Book } from "@prisma/client";

const fallbackImageSrc =
  "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=281000000883B";

export interface SuggestionProps {
  type: string;
  entry: Book | CourseWithDept;
}

export const CourseSuggestionCard = ({ name, code, dept }: CourseWithDept) => {
  return (
    <HStack>
      <Stack>
        <Container alignContent={"left"} marginY={2}>
          <Heading isTruncated as="h4" size="md" color="primaryText">
            {`${dept.abbreviation} ${code}`}
          </Heading>
          <Text color="secondaryText" isTruncated>
            {name || ""}
          </Text>
        </Container>
      </Stack>
    </HStack>
  );
};

export const BookSuggestionCard = ({ isbn, name, imageUrl }: Book) => {
  const { isLoading, data: populatedBook } = useBookQuery(isbn);
  let authorString: string = "-";
  if (populatedBook?.googleBook?.authors) {
    authorString = populatedBook.googleBook.authors.join(", ");
  }

  return (
    <HStack>
      <Image
        maxH={"100px"}
        maxW={"60px"}
        src={imageUrl || fallbackImageSrc}
        alt={"book image"}
      ></Image>
      <Stack>
        <Container alignContent={"left"} marginY={2}>
          <Heading isTruncated as="h4" size="md" color="primaryText">
            {`${name}`}
          </Heading>
          <Skeleton isLoaded={!isLoading}>
            <Text color="secondaryText" isTruncated>
              {authorString}
            </Text>
          </Skeleton>
        </Container>
      </Stack>
    </HStack>
  );
};

export const SuggestionCard = ({ type, entry }: SuggestionProps) => {
  return (
    <>
      {type === "course" ? (
        <CourseSuggestionCard {...(entry as CourseWithDept)}>
          {" "}
        </CourseSuggestionCard>
      ) : (
        <BookSuggestionCard {...(entry as Book)}> </BookSuggestionCard>
      )}
    </>
  );
};

export default SuggestionCard;
