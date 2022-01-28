import { Box, Text, Image, HStack, Spacer, Heading } from "@chakra-ui/react";
import { BookWithAuthor } from "@lib/services/course";
import { getGoogleBooksData, GoogleBook } from "@lib/services/googleBooksSearch";
import { Book } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CARD_WIDTH = "170px"

type BookListProps = {
  books: BookWithAuthor[] | undefined;
}

export default function BookList({ books }: BookListProps) {
  if (!books) {
    return <Text fontSize='2xl' color='gray.500' marginTop="40px"> No books found for this course. </Text>;
  }
  return (
    <Box marginTop="40px">

      <HStack spacing='12px' fontSize='2xl'>
        <Text> Books </Text>
        <Text color='gray.500' > ({books.length} matching) </Text>
      </HStack>

      <Box 
        display='flex' 
        flexDir='row' 
        flexWrap='wrap' 
        marginTop="10px"
      >
        {books.map((book, i) => <Book key={i} book={book} />)}
      </Box>

    </Box>
  );
}

type BookProps = {
  book: BookWithAuthor;
}

function Book({ book }: BookProps) {
  const { name, imageUrl, id, author } = book;
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/book/" + id)
  }

  return (
    <Box
      onClick={handleClick}
      
      overflow='hidden'
      maxW={CARD_WIDTH}
      marginBottom='10px'
      marginRight='10px'
      shadow='md'
      borderRadius='lg' 
      
      cursor='pointer'
      background='white'
      fontSize='xs'
    >
      
      <Image 
        p='1'
        width='100%'
        height='140px'
        objectFit='contain'
        src={imageUrl || ''} 
        alt='book-image'
      />

      <Box p='3' display='flex' flexDir='column'>
        <Heading fontSize='xs' fontWeight='semibold' isTruncated>{name}</Heading>
        <Text color='gray.500' isTruncated>
          {author}
        </Text>
      </Box>

    </Box>
  )
}