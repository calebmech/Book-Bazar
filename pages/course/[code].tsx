import {
  Box,
  Flex,
  Heading,
  Skeleton,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Layout from "@components/Layout";
import LoadingPage from "@components/LoadingPage";
import { PaginationButtons } from "@components/PaginationButtons";
import { parseCourseCode } from "@lib/helpers/backend/parse-course-code";
import pageTitle from "@lib/helpers/frontend/page-title";
import { parsePageString } from "@lib/helpers/frontend/parse-page-string";
import { useBookQueries } from "@lib/hooks/book";
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { getPopulatedBook, PopulatedBook } from "@lib/services/book";
import { CourseWithBooks, getCourseWithBooks } from "@lib/services/course";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { prisma } from "@lib/services/db";
import { BookCardGrid, PostCardGrid } from "@components/CardList";
import { MAX_NUM_POSTS } from "@lib/helpers/constants";

interface CoursePageProps {
  initialCourse: CourseWithBooks;
  initialBooks: PopulatedBook[];
}

const CoursePage: NextPage<Partial<CoursePageProps>> = ({
  initialCourse,
  initialBooks,
}) => {
  const router = useRouter();
  const { code, page: pageString } = router.query;
  const page = parsePageString(pageString);
  const { data: course, isSuccess: isCourseSuccess } = useCourseQuery(
    code,
    initialCourse
  );
  const { data: posts, isLoading } = useCoursePostsQuery(
    code,
    page,
    MAX_NUM_POSTS
  );
  const { data: postsSecondData, isPreviousData } = useCoursePostsQuery(
    code,
    page + 1,
    MAX_NUM_POSTS
  );

  const bookQueries = useBookQueries(
    initialBooks?.map((book) => book.isbn) ?? [],
    initialBooks
  );

  if (!course || bookQueries.some((query) => !query.data)) {
    if (isCourseSuccess && !bookQueries.some((query) => !query.isSuccess)) {
      return <ErrorPage statusCode={404} />;
    }

    return <LoadingPage />;
  }

  const books = bookQueries
    .map((book) => book.data)
    .filter((book) => book) as PopulatedBook[];
  const hasMorePosts = postsSecondData?.length !== 0;

  return (
    <>
      <Head>
        <title>{pageTitle(code?.toString().replace("-", " "))}</title>
      </Head>
      <Layout
        extendedHeader={
          <Skeleton isLoaded={Boolean(course)}>
            {course.name ? (
              <>
                <Text
                  test-id="CourseCode"
                  fontSize="lg"
                  fontWeight="500"
                  textColor="secondaryText"
                >
                  {course.dept.abbreviation} {course.code}
                </Text>
                <Heading
                  test-id="CourseHeading"
                  as="h1"
                  mt="1"
                  fontSize="3xl"
                  fontWeight="500"
                  fontFamily="title"
                >
                  {course.name}
                </Heading>
              </>
            ) : (
              <Heading
                as="h1"
                fontSize="3xl"
                fontWeight="500"
                fontFamily="title"
              >
                {course.dept.abbreviation} {course.code}
              </Heading>
            )}
          </Skeleton>
        }
      >
        <Text fontFamily="title" fontWeight="500" fontSize="2xl">
          Course Books
        </Text>
        <BookCardGrid books={books} />

        <Text fontFamily="title" fontWeight="500" fontSize="2xl" mt="10" mb="4">
          Active Listings
        </Text>
        {isLoading ? (
          <Flex width="100%" height="56" align="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : !posts || posts.length === 0 ? (
          <Text my="10" fontSize="lg">
            No active listings found.
          </Text>
        ) : (
          <>
            <PostCardGrid posts={posts ?? []} />
            {(page === 0
              ? posts.length === MAX_NUM_POSTS
              : posts.length !== 0) && (
              <PaginationButtons
                page={page}
                url={"/course/" + code}
                morePosts={hasMorePosts}
                isLoadingNextPage={isPreviousData}
              />
            )}
          </>
        )}
        <Spacer height="6" />
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<CoursePageProps> = async (
  context
) => {
  const code = context.params?.code;
  if (typeof code !== "string") return { notFound: true };

  const parsedCode = parseCourseCode(code);
  if (!parsedCode) return { notFound: true };

  const course = await getCourseWithBooks(parsedCode);
  if (!course) return { notFound: true };

  const books = (await Promise.all(
    course.books
      .map((book) => getPopulatedBook(book.isbn))
      .filter((book) => book)
  )) as PopulatedBook[];

  return {
    props: {
      initialCourse: course,
      initialBooks: books,
    },
    // Course and books should only change after an index
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Prerender course pages related to most recent posts
  const recentPosts = await prisma.post.findMany({
    take: 50,
    orderBy: {
      updatedAt: "desc",
    },
    distinct: ["bookId"],
    select: {
      book: {
        select: {
          courses: {
            distinct: ["id"],
            include: { dept: true },
          },
        },
      },
    },
  });

  const recentCourses = recentPosts.flatMap((post) => post.book.courses);

  return {
    paths: recentCourses.map((course) => ({
      params: { code: course.dept.abbreviation + "-" + course.code },
    })),
    fallback: true,
  };
};

export default CoursePage;
