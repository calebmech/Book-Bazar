import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export interface BookCardProps {
  name: string, 
  isbn: string, 
  imageUrl: string | null,
  author: string | null,
}

export default function BookCard(props: BookCardProps) {
  const { name, imageUrl, isbn, author } = props;
  const router = useRouter();

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
        p='1'
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
          {author}
        </Text>
      </Box>
    </Box>
  )
}