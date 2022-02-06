import type { NextPage } from "next";
import { useRouter } from "next/router";
import ErrorPage from 'next/error'
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { Skeleton, Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import { BookCardList, PostCardList } from "@components/CardList";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const { isLoading: isLoadingCourseData, data: courseData } = useCourseQuery(code);
  const { data: postsData } = useCoursePostsQuery(code);

  if (!courseData && !isLoadingCourseData) {
    return <ErrorPage statusCode={404}/>;
  }

  const courseName = courseData ? courseData.name + ' ' + courseData.code : '';
  const books = courseData ? courseData.books : [];
  const posts = postsData ? postsData : [];
  
  return (
    <Layout>
      <Skeleton isLoaded={!isLoadingCourseData}>
        <Text
          mt='1'
          fontSize='4xl'
          fontWeight='semibold'
        >
          {courseName}
        </Text>
      </Skeleton>
      
      <BookCardList books={books} isLinkActive={true} />
      <PostCardList posts={posts} isLinkActive={true} />
    </Layout>
  );
};

export default CoursePage;