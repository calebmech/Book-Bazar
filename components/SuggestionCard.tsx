/*
  The suggestion card is used as part of the SearchPanel. It displays
  the autocomplete inputs.
*/

import {
  Box,
  Container,
  Heading,
  HStack,
  Skeleton,
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
import { SearchItem } from "@lib/hooks/algolia";
import { useBookQuery } from "@lib/hooks/book";
import { CourseWithDept } from "@lib/services/course";
import { Book } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CourseSuggestionCardProps {
  course: CourseWithDept;
  onClick?: VoidFunction;
}

const CourseSuggestionCard: React.FC<CourseSuggestionCardProps> = ({
  course,
  onClick,
}) => {
  const { name, code, dept } = course;
  const Card = () => (
    <HStack as={onClick ? "button" : "a"} onClick={() => onClick && onClick()}>
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
  );

  if (!onClick) {
    return (
      <Link href={"/course/" + dept.abbreviation + "-" + code} passHref>
        <Card />
      </Link>
    );
  }

  return <Card />;
};

interface BookSuggestionCardProps {
  book: Book;
  onClick?: VoidFunction;
}

const BookSuggestionCard: React.FC<BookSuggestionCardProps> = ({
  book,
  onClick,
}) => {
  const { isLoading, data: populatedBook } = useBookQuery(book.isbn);
  let authorString: string = "-";
  if (populatedBook?.googleBook?.authors) {
    authorString = populatedBook.googleBook.authors.join(", ");
  }

  const Card = () => (
    <HStack
      as={onClick ? "button" : "a"}
      onClick={() => onClick && onClick()}
      spacing="0"
      alignItems="start"
    >
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
          {resolveBookTitle(populatedBook ?? book)}
        </Heading>
        <Skeleton isLoaded={!isLoading}>
          <Text color="secondaryText" isTruncated>
            {authorString}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} mt="3">
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
        </Skeleton>
      </Container>
    </HStack>
  );

  if (!onClick) {
    return (
      <Link href={"/book/" + book.isbn} passHref>
        <Card />
      </Link>
    );
  }

  return <Card />;
};

export interface SuggestionCardProps {
  item: SearchItem;
  onSelectItem?: (item: SearchItem) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  item,
  onSelectItem,
}) => {
  if (item.type === "course") {
    return (
      <CourseSuggestionCard
        course={item.entry}
        onClick={() => onSelectItem && onSelectItem(item)}
      />
    );
  }

  if (item.type === "book") {
    return (
      <BookSuggestionCard
        book={item.entry}
        onClick={() => onSelectItem && onSelectItem(item)}
      />
    );
  }

  return null;
};

export default SuggestionCard;
