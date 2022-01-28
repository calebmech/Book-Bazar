import { Box, HStack, Text, Image, Flex } from "@chakra-ui/react";
import { BookWithAuthor } from "@lib/services/course";
import { Post, User } from "@prisma/client";
import { useRouter } from "next/router";


interface PostListProps {
  posts: {
    book: BookWithAuthor;
    id: string;
    price: number;
    description: string;
    imageUrl: string | null;
    userId: string;
    user: User;
  }[] | null | undefined
}

export default function PostList({ posts }: PostListProps) {
  if (!posts || posts.length == 0) {
    return <Text fontSize='2xl' color='gray.500' marginTop="40px"> There are no active listings for the books used in this course. </Text>;
  }
  return (
    <Box marginTop="40px">

      <HStack spacing='12px' fontSize='2xl'>
        <Text> Active Listings </Text>
        <Text color='gray.500' > ({posts.length} matching) </Text>
      </HStack>

      <Box 
        display='flex' 
        flexDir='row' 
        flexWrap='wrap' 
        marginTop="10px"
      >
        {posts.map((post, i) => <Post key={i} post={post}/>)}
      </Box>

    </Box>
  );
}

const CARD_WIDTH = "350px"

interface PostProps {
  post: {
    book: BookWithAuthor;
    id: string;
    price: number;
    description: string;
    imageUrl: string | null;
    userId: string;
    user: User;
  }
}

function Post({ post }: PostProps) {
  const { id, price, description, book, user } = post;
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
            height="30px"
            width="30px"
            borderRadius='30px'
          />

          <Box color='gray.500' lineHeight='40px' fontSize='20px'>
            {user.name}
          </Box>
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
        <Box
          fontWeight='semibold'
        >
          {book.name}
        </Box>
        <Box color='gray.500' isTruncated>
          {book.author}
        </Box>
        <Box fontWeight='bold' fontSize='xl'>
          ${price}
        </Box>
        <Box color='gray.500'>
          {description}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      p='2'
      maxW={CARD_WIDTH}
      background='white'
      borderWidth='1px' 
      borderRadius='lg' 
      overflow='hidden'
      marginRight='10px'
      marginBottom='10px'
      cursor='pointer'
      display='flex'
      flexDir='row'
      shadow='md'
      onClick={handleClick}
    >
      <Image 
        marginTop='10px'
        width='150px'
        maxH='200px'
        objectFit='contain'
        src={book.imageUrl || "https://via.placeholder.com/150"} 
        fallbackSrc="https://via.placeholder.com/150"
        alt="book-image" 
      />

      <Box 
        width='180px'
        display='flex' 
        flexDir='column' 
        fontSize='sm'
        justifyContent='space-between'
      >
        <Details />
        <UserLine />
      </Box>
    </Box>
  )
}