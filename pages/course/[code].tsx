import type { NextPage } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { Heading, Skeleton, Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import { BookCardList, PostCardList } from "@components/CardList";
import pageTitle from "@lib/helpers/frontend/page-title";
import Head from "next/head";

const MAX_NUM_POSTS = 4

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { code, page: pageString } = router.query;
  const { isLoading: isLoadingCourseData, data: courseData } =
    useCourseQuery(code);
    var page: number;

  if (!pageString || Array.isArray(pageString)) {
    page = 0;
  } else {
    page = Number.parseInt(pageString);
  }

  const { data: postsData } = useCoursePostsQuery(code, page, MAX_NUM_POSTS);
  const { data: postsSecondData } = useCoursePostsQuery(
    code,
    page + 1,
    MAX_NUM_POSTS
  );

  if (!courseData && !isLoadingCourseData) {
    return <ErrorPage statusCode={404} />;
  }

  const courseName = courseData
    ? courseData.name + " " + courseData.code
    : "PlaceHolder";
  const books = courseData ? courseData.books : [];
  const posts = postsData ? postsData : [];
  const morePosts = postsSecondData ? postsSecondData.length !== 0 : false;

  const bookGrid = (
    <Grid
      mt="3"
      templateColumns={{
        base: "repeat(auto-fill, minmax(128px, 1fr))",
      }}
      gap={{
        base: 4,
        md: 2,
      }}
    >
      {books.map((book, i) => {
        return (
          <GridItem key={i} justifyContent="center">
            <BookCard book={book} isLinkActive={true} />
          </GridItem>
        );
      })}
    </Grid>
  );

  const postGrid = (
    <Grid
      mt="3"
      templateColumns={{
        base: "repeat(auto-fill, minmax(380px, 1fr))",
        md: "repeat(auto-fill, minmax(340px, 1fr))",
      }}
      gap={{
        base: 4,
        md: 2,
      }}
    >
      {posts.map((post, i) => {
        return (
          <GridItem key={i} justifyContent="center">
            <PostCard post={post} isLinkActive={true} />
          </GridItem>
        );
      })}
    </Grid>
  );

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
