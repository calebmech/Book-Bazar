import { Box, Image, Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import BookList from "@components/BookList";
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { Book } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import PostList from "@components/PostList";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: course } = useCourseQuery(id);
  const { data: posts } = useCoursePostsQuery(id);
  
  return (
    <Layout>
      <Box display='flex' flexDir='column'>
        <Text
          mt='1'
          fontSize='4xl'
          fontWeight='semibold'
        >
          {course?.name} {course?.code}
        </Text>
      </Box>
      <BookList books={course?.books}/>
      <PostList posts={posts}/>
    </Layout>
  );
};

export default CoursePage;