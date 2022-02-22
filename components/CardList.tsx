import { Box, Text, HStack, Wrap } from "@chakra-ui/react";
import { CourseWithDept } from "@lib/services/course";
import { PostWithBookWithUser } from "@lib/services/post";
import { Book } from "@prisma/client";
import { ReactNode } from "react";
import BookCard from "./BookCard";
import CourseCard from "./CourseCard";
import PostCard from "./PostCard";

interface PostCardListProps {
  posts: PostWithBookWithUser[];
  isLinkActive: boolean;
  itemName?: string;
}
export function PostCardList({
  posts,
  isLinkActive,
  itemName = "Active Listing",
}: PostCardListProps) {
  const items = posts.map((post, i) => {
    return <PostCard key={i} post={post} isLinkActive={isLinkActive} />;
  });
  return <CardList items={items} itemName={itemName} />;
}

interface BookCardListProps {
  books: Book[];
  isLinkActive: boolean;
}
export function BookCardList({ books, isLinkActive }: BookCardListProps) {
  const items = books.map((book, i) => {
    return <BookCard key={i} book={book} isLinkActive={isLinkActive} />;
  });
  return <CardList items={items} itemName="Book" />;
}

interface CourseCardListProps {
  courses: CourseWithDept[];
  isLinkActive: boolean;
}
export function CourseCardList({ courses, isLinkActive }: CourseCardListProps) {
  const items = courses.map((course, i) => {
    return <CourseCard key={i} course={course} isLinkActive={isLinkActive} />;
  });
  return <CardList items={items} itemName="Course" />;
}

type CardListProps = {
  itemName: string;
  items: ReactNode[];
};
function CardList({ itemName, items }: CardListProps) {
  if (items.length === 0) {
    return (
      <Text my="20" fontSize="lg" textAlign="center">
        No {itemName.toLowerCase()}s found.
      </Text>
    );
  }

  return (
    <Box mt="10">
      <HStack spacing="0" flexWrap="wrap">
        <Text fontFamily="title" fontWeight="500" fontSize="2xl" mr="2">
          {itemName}s
        </Text>
        <Text color="secondaryText" fontSize="xl">
          ({items.length} matching)
        </Text>
      </HStack>
      <Wrap mt="4">{items}</Wrap>
    </Box>
  );
}
