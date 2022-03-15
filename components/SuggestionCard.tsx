/*
  The suggestion card is used as part of the SearchPanel. It displays
  the autocomplete inputs.
*/

import {
  Box,
  Container,
  Heading,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { AcademicCapIcon } from "@heroicons/react/solid";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { AutocompleteItem } from "@lib/hooks/autocomplete";
import { PopulatedBook } from "@lib/services/book";
import { CourseWithDept } from "@lib/services/course";
import Image from "next/image";
import Link from "next/link";

export const CourseSuggestionCard = ({ name, code, dept }: CourseWithDept) => {
  return (
    <Link href={"/course/" + dept.abbreviation + "-" + code} passHref>
      <HStack as="a">
        {/* Let box width be controlled by flex parent */}
        <Container marginX="0" marginY="2" flex="1" width="0">
          <Heading isTruncated as="p" size="md" color="primaryText" mb="1">
            {`${dept.abbreviation} ${code}`}
          </Heading>
          <Text color="secondaryText" isTruncated>
            {name || ""}
          </Text>
        </Container>
      </HStack>
    </Link>
  );
};

export const BookSuggestionCard = (populatedBook: PopulatedBook) => {
  let authorString: string = "-";
  if (populatedBook?.googleBook?.authors) {
    authorString = populatedBook.googleBook.authors.join(", ");
  }

  return (
    <Link href={"/book/" + populatedBook.isbn} passHref>
      <HStack as="a" spacing="0" alignItems="start">
        <Box height="90px" width="60px" position="relative">
          <Image
            layout="fill"
            objectFit="contain"
            src={resolveImageUrl(populatedBook)}
            alt={"book image"}
          />
        </Box>
        {/* Let box width be controlled by flex parent */}
        <Container flex="1" width="0">
          <Heading isTruncated as="p" size="md" color="primaryText" mb="1">
            {resolveBookTitle(populatedBook)}
          </Heading>
          <Text color="secondaryText" isTruncated>
            {authorString}
          </Text>
          <Box overflowX="auto" whiteSpace="nowrap">
            {populatedBook?.courses.slice(0, 3).map((course) => (
              <Tag key={course.id} mr="2">
                <TagLeftIcon as={AcademicCapIcon} />
                <TagLabel isTruncated={false} whiteSpace="nowrap">
                  {course.dept.abbreviation} {course.code}
                </TagLabel>
              </Tag>
            ))}
            {populatedBook?.courses && populatedBook.courses.length > 3 && (
              <span>…</span>
            )}
          </Box>
        </Container>
      </HStack>
    </Link>
  );
};

export interface SuggestionCardProps {
  item: AutocompleteItem;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ item }) => {
  if (item.type === "course") {
    return <CourseSuggestionCard {...item.entry} />;
  }

  if (item.type === "book") {
    return <BookSuggestionCard {...item.entry} />;
  }

  return <></>;
};

export default SuggestionCard;
