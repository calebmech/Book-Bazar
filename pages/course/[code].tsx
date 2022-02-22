import type { NextPage } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { Heading, Skeleton, Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import { BookCardList, PostCardList } from "@components/CardList";
import pageTitle from "@lib/helpers/frontend/page-title";
import Head from "next/head";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const { isLoading: isLoadingCourseData, data: courseData } =
    useCourseQuery(code);
  const { data: postsData } = useCoursePostsQuery(code);

  if (!courseData && !isLoadingCourseData) {
    return <ErrorPage statusCode={404} />;
  }

  const books = courseData ? courseData.books : [];
  const posts = postsData ? postsData : [];

  return (
    <>
      <Head>
        <title>{pageTitle(code?.toString().replace("-", " "))}</title>
      </Head>
      <Layout
        extendedHeader={
          <Skeleton isLoaded={!isLoadingCourseData}>
            <Text fontSize="lg" fontWeight="500" textColor="secondaryText">
              {courseData?.dept.abbreviation} {courseData?.code}
            </Text>
            <Heading
              as="h1"
              mt="1"
              fontSize="3xl"
              fontWeight="500"
              fontFamily="title"
            >
              {courseData?.name}
            </Heading>
          </Skeleton>
        }
      >
        <BookCardList books={books} isLinkActive={true} />
        <PostCardList posts={posts} isLinkActive={true} />
      </Layout>
    </>
  );
};

export default CoursePage;
