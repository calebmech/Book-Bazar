import { Box, Text, HStack, Flex } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import BookCard, { BookCardProps } from "./BookCard";
import PostCard, { PostCardProps } from "./PostCard";

export enum ListType {
  BookCardList,
  PostCardList
}

type ListProps = {
  type: ListType;
  books: BookCardProps[] | undefined;
  posts: PostCardProps[] | undefined;
}

export default function CardList({type, books, posts}: ListProps) {
  var zeroItemString: string;
  var itemString: string;
  var length: number;
  var childrenCards: ReactJSXElement[] | undefined;

  if (type === ListType.BookCardList) {
    zeroItemString = "No books found for this course."
    itemString = "Books";
    length = books ? books.length : 0;
    childrenCards = books && books.map((book, i) => <BookCard key={i} {...book} />)
  }
  else {
    zeroItemString = "There are no active listings for the books used in this course."
    itemString = "Active Listings";
    length = posts ? posts.length : 0;
    childrenCards = posts && posts.map((post, i) => <PostCard key={i} {...post} />)
  }
    
  if (length === 0) {
    return (
      <Text 
        fontSize='2xl' 
        color='gray.500' 
        mt="10"
      > 
        { zeroItemString }
      </Text>
    );
  }

  return (
    <Box mt="10">
      <HStack spacing='12px' fontSize='2xl'>
        <Text> 
          { itemString }
        </Text>
        <Text color='gray.500'> 
          ({length} matching) 
        </Text>
      </HStack>

      <Flex 
        direction='row' 
        wrap='wrap'
      >
        {childrenCards}
      </Flex>
    </Box>
  );
}