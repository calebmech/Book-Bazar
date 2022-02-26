import type { NextPage } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { Box, Heading, Skeleton, Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import {
  BookCardGrid,
  MAX_NUM_POSTS,
  PostCardGrid,
} from "@components/CardList";
import pageTitle from "@lib/helpers/frontend/page-title";
import Head from "next/head";
import { PaginationButtons } from "@components/PaginationButtons";
import { parsePageString } from "@lib/helpers/frontend/parse-page-string";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { code, page: pageString } = router.query;
  const { isLoading: isLoadingCourseData, data: courseData } =
    useCourseQuery(code);
  const page = parsePageString(pageString);
  const { data: postsData } = useCoursePostsQuery(code, page, MAX_NUM_POSTS);
  const { data: postsSecondData, isPreviousData } = useCoursePostsQuery(
    code,
    page + 1,
    MAX_NUM_POSTS
  );

  if (!courseData && !isLoadingCourseData) {
    return <ErrorPage statusCode={404} />;
  }

  const books = courseData ? courseData.books : [];
  const posts = postsData ? postsData : [];
  const morePosts = postsSecondData ? postsSecondData.length !== 0 : false;

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
        <Text mt="10" fontSize="2xl">
          Course Books
        </Text>
        <BookCardGrid books={books} />

        <Text mt="10" fontSize="2xl">
          {posts.length !== 0 ? "Active Listings" : "No Active Listings"}
        </Text>

        <PostCardGrid posts={posts} />
        {(page === 0 ? posts.length === MAX_NUM_POSTS : posts.length !== 0) && (
          <PaginationButtons
            page={page}
            url={"/course/" + code}
            morePosts={morePosts}
            isLoadingNextPage={isPreviousData}
          />
        )}
      </Layout>
    </>
  );
};

export default CoursePage;
