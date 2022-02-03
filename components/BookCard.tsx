import { Box, Heading, Text, Skeleton, Flex } from "@chakra-ui/react";
import Image from 'next/image'
import { useBookQuery } from "@lib/hooks/book";
import { Book } from "@prisma/client";
import Link from "next/link";

type BookCardProps = {
  book: Book;
  isLinkActive: boolean;
}

export default function BookCard({ book, isLinkActive }: BookCardProps) {
  const { name, imageUrl, isbn } = book;
  const { isLoading, data: populatedBook } = useBookQuery(isbn);
  let authorString: string = "-";
  
  if (populatedBook?.googleBook?.authors) {
    authorString = populatedBook.googleBook.authors.join(', ');
  }

  const card = (
    <Box
      overflow='hidden'
      maxW='170px'
      mb='3'
      mr='3'
      shadow='md'
      borderRadius='lg' 
      background='secondaryBackground'
      fontSize='xs'
      _hover={{ shadow: 'xl' }}
      transition='0.3s'
      cursor={isLinkActive ? 'pointer' : 'cursor'}
    >
      <Image 
        width='170px'
        height='230px'
        src={imageUrl || ''} 
        alt='book-image'
      />

      <Flex p='3' flexDir='column'>
        <Heading 
          fontSize='xs' 
          fontWeight='semibold' 
          isTruncated
        >
          {name ?? "Book Name Unavailable"}
        </Heading>

        <Skeleton isLoaded={!isLoading}>
          <Text color='secondaryText' isTruncated>
              {authorString}
          </Text>
        </Skeleton>
      </Flex>
    </Box>
  );

  if (isLinkActive) {
    return (
      <Link href={"/book/" + isbn}>
        {card}
      </Link>
    );
  }

  return card;
}