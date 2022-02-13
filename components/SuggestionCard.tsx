/*
  The suggestion card is used as part of the SearchPanel. It displays
  the autocomplete inputs.
*/

import {
  Text,
  Container,
  Heading,
  HStack,
  Stack,
  Image,
  Skeleton,
  Link,
} from "@chakra-ui/react";
import { useBookQuery } from "@lib/hooks/book";
import { CourseWithDept } from "@lib/services/course";
import { Book } from "@prisma/client";
import { AutocompleteItem } from "@lib/hooks/autocomplete";

const fallbackImageSrc =
  "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=281000000883B";

export const CourseSuggestionCard = ({ name, code, dept }: CourseWithDept) => {
  return (
    <Link href={"/course/" + dept.abbreviation + "-" + code}>
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
    </Link>
  );
};

export const BookSuggestionCard = ({ isbn, name, imageUrl }: Book) => {
  const { isLoading, data: populatedBook } = useBookQuery(isbn);
  let authorString: string = "-";
  if (populatedBook?.googleBook?.authors) {
    authorString = populatedBook.googleBook.authors.join(", ");
  }

  return (
    <Link href={"/book/" + isbn}>
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
    </Link>
  );
};

export interface SuggestionCardProps {
  item: AutocompleteItem;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ item }) => {
  return (
    <>
      {item.type === "course" ? (
        <CourseSuggestionCard {...(item.entry as CourseWithDept)}>
          {" "}
        </CourseSuggestionCard>
      ) : (
        <BookSuggestionCard {...(item.entry as Book)}> </BookSuggestionCard>
      )}
    </>
  );
};

export default SuggestionCard;
