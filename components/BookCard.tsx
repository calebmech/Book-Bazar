import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { useBookQuery } from "@lib/hooks/book";
import { Book } from "@prisma/client";
import { useRouter } from "next/router";

export default function BookCard({ name, imageUrl, isbn }: Book) {
  const { isLoading, data: populatedBook } = useBookQuery(isbn);
  const router = useRouter();

  const authors = (): string => {
    if (isLoading) {
      return "Loading Authors..."
    }
    if (populatedBook?.googleBook?.authors) {
      return populatedBook.googleBook.authors.join(', ')
    }
    return "No Authors"
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/book/" + isbn)
  }
  

  return (
    <Box
      overflow='hidden'
      maxW='170px'
      mb='3'
      mr='3'
      shadow='md'
      borderRadius='lg' 
      background='white'
      fontSize='xs'
      _hover={{ shadow: 'xl' }}
      transition='0.3s'
      cursor='pointer'
      onClick={handleClick}
    >
      
      <Image 
        w='100%'
        h='200px'
        objectFit='contain'
        src={imageUrl || ''} 
        alt='book-image'
      />

      <Box 
        p='3' 
        display='flex' 
        flexDir='column'
      >
        <Heading 
          fontSize='xs' 
          fontWeight='semibold' 
          isTruncated
        >
          {name}
        </Heading>

        <Text color='gray.500' isTruncated>
          {authors()}
        </Text>
      </Box>
    </Box>
  )
}