import { Wrap, Grid, GridItem } from "@chakra-ui/react";
import { CourseWithDept } from "@lib/services/course";
import { PostWithBookWithUser } from "@lib/services/post";
import { Book } from "@prisma/client";
import BookCard from "./BookCard";
import CourseCard from "./CourseCard";
import PostCard from "./PostCard";

export const MAX_NUM_POSTS = 4;
interface PostCardListProps {
  posts: PostWithBookWithUser[];
}
export function PostCardGrid({ posts }: PostCardListProps) {
  return (
    <Grid
      mt="3"
      templateColumns={{
        base: "repeat(auto-fill, minmax(250px, 1fr))",
        sm: "repeat(auto-fill, minmax(350px, 1fr))",
        md: "repeat(auto-fill, minmax(380px, 1fr))",
      }}
      gap={4}
    >
      {posts.map((post, i) => {
        return (
          <GridItem key={i}>
            <PostCard post={post} isLinkActive={true} />
          </GridItem>
        );
      })}
    </Grid>
  );
}

interface BookCardListProps {
  books: Book[];
}
export function BookCardGrid({ books }: BookCardListProps) {
  return (
    <Grid
      mt="3"
      templateColumns={{
        base: "repeat(auto-fill, minmax(128px, 1fr))",
        md: "repeat(auto-fill, minmax(128px, 1fr))",
      }}
      gap={4}
    >
      {books.map((book, i) => {
        return (
          <GridItem key={i}>
            <BookCard book={book} isLinkActive={true} />
          </GridItem>
        );
      })}
    </Grid>
  );
}

interface CourseCardListProps {
  courses: CourseWithDept[];
}
export function CourseCardList({ courses }: CourseCardListProps) {
  return (
    <Wrap mt="2">
      {courses.map((course, i) => {
        return <CourseCard key={i} course={course} isLinkActive={true} />;
      })}
    </Wrap>
  );
}
