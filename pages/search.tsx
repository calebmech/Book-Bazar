import { Heading, Text } from "@chakra-ui/react";
import { BookCardList, CourseCardList } from "@components/CardList";
import Layout from "@components/Layout";
import Loading from "@components/Loading";
import pageTitle from "@lib/helpers/frontend/page-title";
import { useAlgolia } from "@lib/hooks/algolia";
import { CourseWithDept } from "@lib/services/course";
import { Book } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Search: NextPage = () => {
  const { query } = useRouter();
  const search = query.q && !Array.isArray(query.q) ? query.q : "";

  const { isLoading, data: algoliaSearchResponse } = useAlgolia(search);

  // TODO Replace with something to indicate loading
  if (isLoading) {
    return <Loading />;
  }

  const hits = algoliaSearchResponse?.hits || [];

  const courses = hits
    .filter((hit) => hit.type === "course")
    .map((course) => course.entry as CourseWithDept);

  const books = hits
    .filter((hit) => hit.type === "book")
    .map((book) => book.entry as Book);

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
        {courses.length > 0 && (
          <CourseCardList courses={courses} isLinkActive={true} />
        )}
        {books.length > 0 && <BookCardList books={books} isLinkActive={true} />}
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
