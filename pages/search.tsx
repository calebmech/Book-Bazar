import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAlgolia } from "@lib/hooks/algolia";
import { Book } from "@prisma/client";
import { CourseWithDept } from "@lib/services/course";
import { BookCardList, CourseCardList } from "@components/CardList";
import { Flex, Heading } from "@chakra-ui/react";
import Layout from "@components/Layout";

enum HEADER {
  RESULTS_AVAILABLE = "Results for ",
  NO_RESULTS_AVAILABLE = "No results for ",
  COURSES = "Courses",
  BOOKS = "Books",
}

const Search: NextPage = () => {
  const { query } = useRouter();
  const search = query.q && !Array.isArray(query.q) ? query.q : "";

  const { isLoading, data: algoliaSearchResponse } = useAlgolia(search);

  // TODO Replace with something to indicate loading
  if (isLoading) {
    return <></>;
  }

  const hits = algoliaSearchResponse?.hits || [];

  const courses = hits
    .filter((hit) => hit.type === "course")
    .map((course) => course.entry as CourseWithDept);

  const books = hits
    .filter((hit) => hit.type === "book")
    .map((book) => book.entry as Book);

  return (
    <Layout>
      <Flex marginY={8} marginX={10} direction="column">
        <Heading size="lg">
          {courses.length > 0 || books.length > 0
            ? `${HEADER.RESULTS_AVAILABLE}"${search}"`
            : `${HEADER.NO_RESULTS_AVAILABLE}"${search}"`}
        </Heading>

        {courses.length > 0 ? (
          <CourseCardList courses={courses} isLinkActive={true} />
        ) : (
          <div className="no books"></div>
        )}

        {books.length > 0 ? (
          <BookCardList books={books} isLinkActive={true} />
        ) : (
          <div className="no courses"></div>
        )}
      </Flex>
    </Layout>
  );
};

export default Search;
