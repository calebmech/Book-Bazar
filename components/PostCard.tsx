import { HStack, Box, Image, Text, Flex } from "@chakra-ui/react";
import { BookWithAuthor } from "@lib/services/course";
import { User } from "@prisma/client";
import { useRouter } from "next/router";

export interface PostCardProps {
  book: BookWithAuthor;
  id: string;
  price: number;
  description: string;
  imageUrl: string | null;
  userId: string;
  user: User | null;
}

export default function PostCard(props: PostCardProps) {
  const { id, price, description, book, user, imageUrl } = props;
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/post/" + id)
  }

  const UserLine = () => {
    if (user) {
      return (
        <HStack>
          <Image 
            src={user.imageUrl || 'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'} 
            alt="profilepic"
            h="30px"
            w="30px"
            borderRadius='30px'
          />

          <Text color='gray.500' fontSize='sm' isTruncated>
            {user.name}
          </Text>
        </HStack>
      )
    }
    else {
      return null;
    }
  }

  const Details = () => {
    return (
      <Box >
        <Text fontWeight='semibold'>
          {book.name}
        </Text>
        <Text color='gray.500' isTruncated>
          {book.author}
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
        <UserLine />
      </Flex>
    </Flex>
  )
}