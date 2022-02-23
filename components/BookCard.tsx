import { Box, Heading, Text, Skeleton, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useBookQuery } from "@lib/hooks/book";
import { Book } from "@prisma/client";
import Link from "next/link";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";

type BookCardProps = {
  book: Book;
  isLinkActive: boolean;
};

export default function BookCard({ book, isLinkActive }: BookCardProps) {
  const { isbn } = book;
  const { isLoading, data: populatedBook } = useBookQuery(isbn);
  let authorString: string = "-";

  if (populatedBook?.googleBook?.authors) {
    authorString = populatedBook.googleBook.authors.join(", ");
  }

  const card = (
    <Box
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
          src={resolveImageUrl(populatedBook)}
          alt="book-image"
        />
      </Box>

      <Flex p="3" flexDir="column">
        <Heading fontSize="xs" fontWeight="semibold" isTruncated>
          {resolveBookTitle(populatedBook ?? book) ?? "Book Name Unavailable"}
        </Heading>

        <Skeleton isLoaded={!isLoading}>
          <Text color="secondaryText" isTruncated>
            {authorString}
          </Text>
        </Skeleton>
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
