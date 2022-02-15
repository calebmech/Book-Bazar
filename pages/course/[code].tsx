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
import { PaginationButtons } from "@components/PaginationButtons";
import pageTitle from "@lib/helpers/frontend/page-title";
import { Head } from "next/document";

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
        <Skeleton isLoaded={!isLoadingCourseData}>
          <Text mt="1" fontSize="4xl" fontWeight="semibold">
            {courseName}
          </Text>
        </Skeleton>

        <Skeleton isLoaded={!isLoadingCourseData}>
          <Text mt="10" fontSize="2xl">
            Course Books
          </Text>
        </Skeleton>
        <BookCardGrid books={books} />

        <Skeleton isLoaded={!isLoadingCourseData}>
          <Text mt="10" fontSize="2xl">
            Active Listings
          </Text>
        </Skeleton>

        <Box
          h={{
            base: "auto",
            md: "450px",
          }}
        >
          <PostCardGrid posts={posts} />
        </Box>

        {(page === 0 ? posts.length === MAX_NUM_POSTS : posts.length !== 0) && (
          <PaginationButtons
            page={page}
            url={"/course/" + code}
            morePosts={morePosts}
          />
        )}
      </Layout>
    </>
  );
};

export default CoursePage;
