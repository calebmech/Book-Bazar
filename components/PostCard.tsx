import {  Box, Image, Text, Flex } from "@chakra-ui/react";
import { useBookQuery } from "@lib/hooks/book";
import { PostWithUser } from "@lib/services/post";
import { useRouter } from "next/router";
import UserWithAvatar from "./UserWithAvatar";

export default function PostCard(post: PostWithUser) {
  const { id, price, description, user, bookId, imageUrl } = post;
  const { data: book } = useBookQuery(bookId);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/post/" + id)
  }

  const Details = () => {
    return (
      <Box >
        <Text fontWeight='semibold'>
          {book?.name}
        </Text>
        <Text color='gray.500' isTruncated>
          {book?.googleBook?.authors?.join(',')}
        </Text>
        <Text fontWeight='bold' fontSize='xl'>
          ${price}
        </Text>
        <Text color='gray.500'>
          {description}
        </Text>
      </Box>
    )
  }

  return (
    <Flex
      w="350px"
      background='white'
      overflow='hidden'
      borderRadius='lg' 
      mb='3'
      mr='3'
      direction='row'
      shadow='md'
      _hover={{ shadow: 'xl' }}
      transition='0.3s'
      cursor='pointer'
      onClick={handleClick}
    >
      <Image 
        maxH='200px'
        objectFit='contain'
        src={imageUrl || "https://via.placeholder.com/150"} 
        fallbackSrc="https://via.placeholder.com/150"
        alt="book-image" 
        borderLeftRadius="lg"
      />

      <Flex 
        w='200px'
        direction='column' 
        justify='space-between'
        fontSize='sm'
        ml='1'
        p='2'
      >
        <Details />
        <UserWithAvatar user={user} />
      </Flex>
    </Flex>
  )
}