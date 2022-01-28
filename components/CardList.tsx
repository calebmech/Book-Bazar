import { Box, Text, HStack, Flex, Wrap } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { PostWithUser } from "@lib/services/post";
import { Book } from "@prisma/client";
import BookCard from "./BookCard";
import PostCard from "./PostCard";

interface PostCardListProps {
  posts: PostWithUser[] | undefined;
}
export function PostCardList({posts}: PostCardListProps) {
  const items = posts?.map((post, i) => <PostCard key={i} {...post} />);
  return <CardList items={items} itemName='Active Listing' />
}

interface BookCardListProps {
  books: Book[] | undefined;
}
export function BookCardList({books}: BookCardListProps) {
  const items = books?.map((book, i) => <BookCard key={i} {...book} />);
  return <CardList items={items} itemName='Book' />
}

type CardListProps = {
  itemName: string;
  items: ReactJSXElement[] | undefined;
}
function CardList({ itemName, items }: CardListProps) {
  if (!items || items.length === 0) {
    return (
      <Text 
        mt="10"
        fontSize='2xl' 
        color='gray.500' 
      > 
        No { itemName }s found.
      </Text>
    );
  };

  return (
    <Box mt="10">
      <HStack spacing='12px' fontSize='2xl'>
        <Text> 
          { itemName }s
        </Text>
        <Text color='gray.500'> 
          ({ items.length } matching) 
        </Text>
      </HStack>
      <Wrap mt='2' >
        { items }
      </Wrap>
    </Box>
  );
}