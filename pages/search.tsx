import { Heading, HStack, Text } from "@chakra-ui/react";
import { CourseCardList, BookCardGrid } from "@components/CardList";
import Layout from "@components/Layout";
import LoadingPage from "@components/LoadingPage";
import pageTitle from "@lib/helpers/frontend/page-title";
import { useAlgolia } from "@lib/hooks/algolia";
import { PopulatedBook } from "@lib/services/book";
import { CourseWithDept } from "@lib/services/course";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Search: NextPage = () => {
  const { query } = useRouter();
  const search = query.q && !Array.isArray(query.q) ? query.q : "";

  const { isLoading, data: algoliaSearchResponse } = useAlgolia(search);

  if (isLoading) {
    return <LoadingPage />;
  }

  const hits = algoliaSearchResponse?.hits || [];

  const courses = hits
    .filter((hit) => hit.type === "course")
    .map((course) => course.entry as CourseWithDept);

  const books = hits
    .filter((hit) => hit.type === "book")
    .map((book) => book.entry as PopulatedBook);

  const SearchResults = () => {
    if (courses.length === 0 && books.length === 0) {
      return (
        <Text mt="10" fontSize="xl" color="secondaryText">
          No courses or books found.
        </Text>
      );
    }

    return (
      <>
        <HStack mt="10" mb="4">
          <Text fontFamily="title" fontWeight="500" fontSize="2xl">
            Courses
          </Text>
          <Text fontSize="xl" color="tertiaryText">
            ({courses.length} matching)
          </Text>
        </HStack>

        {courses.length === 0 ? (
          <Text fontSize="lg" color="secondaryText">
            No courses found
          </Text>
        ) : (
          <CourseCardList courses={courses} />
        )}

        <HStack mt="10" mb="4">
          <Text fontFamily="title" fontWeight="500" fontSize="2xl">
            Books
          </Text>
          <Text fontSize="xl" color="tertiaryText">
            ({books.length} matching)
          </Text>
        </HStack>
        {books.length === 0 ? (
          <Text fontSize="lg" color="secondaryText">
            No books found
          </Text>
        ) : (
          <BookCardGrid books={books} />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{pageTitle(`Results for “${search}”`)}</title>
      </Head>
      <Layout
        extendedHeader={
          <Heading as="h1" size="lg" fontWeight="500" fontFamily="title">
            Results for “{search}”
          </Heading>
        }
      >
        <SearchResults />
      </Layout>
    </>
  );
};

export default Search;
