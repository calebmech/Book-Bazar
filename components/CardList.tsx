import { Box, Text, HStack, Wrap } from "@chakra-ui/react";
import { PostWithBookWithUser } from "@lib/services/post";
import { Book } from "@prisma/client";
import { ReactNode } from "react";
import BookCard from "./BookCard";
import PostCard from "./PostCard";

interface PostCardListProps {
  posts: PostWithBookWithUser[];
  isLinkActive: boolean;
}
export function PostCardList({ posts, isLinkActive }: PostCardListProps) {
  const items = posts.map((post, i) => {
    return <PostCard key={i} post={post} isLinkActive={isLinkActive} />;
  });
  return <CardList items={items} itemName='Active Listing' />;
}

interface BookCardListProps {
  books: Book[];
  isLinkActive: boolean;
}
export function BookCardList({ books, isLinkActive }: BookCardListProps) {
  const items = books.map((book, i) => {
    return <BookCard key={i} book={book} isLinkActive={isLinkActive} />;
  });
  return <CardList items={items} itemName='Book' />;
}

type CardListProps = {
  itemName: string;
  items: ReactNode[];
}
function CardList({ itemName, items }: CardListProps) {
  if (items.length === 0) {
    return (
      <Text 
        mt="10"
        fontSize='2xl' 
        color='secondaryText' 
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
        <Text color='secondaryText'> 
          ({ items.length } matching) 
        </Text>
      </HStack>
      <Wrap mt='2' >
        { items }
      </Wrap>
    </Box>
  );
}