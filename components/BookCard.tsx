import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { PopulatedBook } from "@lib/services/book";
import Image from "next/image";
import Link from "next/link";

type BookCardProps = {
  book: PopulatedBook;
  isLinkActive: boolean;
  width?: string;
};

export default function BookCard({ book, isLinkActive, width }: BookCardProps) {
  const { isbn } = book;
  let authorString: string = "-";

  if (book?.googleBook?.authors) {
    authorString = book.googleBook.authors.join(", ");
  }

  const card = (
    <Box
      maxW={width ?? "auto"}
      overflow="hidden"
      shadow="md"
      borderRadius="lg"
      background="secondaryBackground"
      fontSize="xs"
      _hover={{ shadow: isLinkActive ? "xl" : "md" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
    >
      <Box
        width="100%"
        height="180px"
        position="relative"
        background="tertiaryBackground"
      >
        <Image
          layout="fill"
          objectFit="contain"
          src={resolveImageUrl(book)}
          alt="book-image"
        />
      </Box>

      <Flex p="3" flexDir="column">
        <Heading fontSize="xs" fontWeight="semibold" isTruncated>
          {resolveBookTitle(book) ?? "Book Name Unavailable"}
        </Heading>

        <Text color="secondaryText" isTruncated>
          {authorString}
        </Text>
      </Flex>
    </Box>
  );

  if (isLinkActive) {
    return (
      <Link href={"/book/" + isbn} passHref>
        {card}
      </Link>
    );
  }

  return card;
}
