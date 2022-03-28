import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { PostCardGrid } from "@components/CardList";
import Layout from "@components/Layout";
import LoadingPage from "@components/LoadingPage";
import { PaginationButtons } from "@components/PaginationButtons";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ExternalLinkIcon,
  OfficeBuildingIcon,
  ViewListIcon,
} from "@heroicons/react/solid";
import { MAX_NUM_POSTS } from "@lib/helpers/constants";
import pageTitle from "@lib/helpers/frontend/page-title";
import { parsePageString } from "@lib/helpers/frontend/parse-page-string";
import {
  resolveBookTitle,
  resolveCampusStoreLink,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { formatIntPrice } from "@lib/helpers/priceHelpers";
import { useBookPostsQuery, useBookQuery } from "@lib/hooks/book";
import { getPopulatedBook, PopulatedBook } from "@lib/services/book";
import { prisma } from "@lib/services/db";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface BookPageProps {
  initialBook: PopulatedBook;
}

const BookPage: NextPage<Partial<BookPageProps>> = ({ initialBook }) => {
  const router = useRouter();
  const { isbn, page: pageString } = router.query;
  const page = parsePageString(pageString);
  const { data: book, isSuccess: isBookSuccess } = useBookQuery(isbn, {
    initialData: initialBook,
  });

  const { data: posts, isLoading: isLoadingPosts } = useBookPostsQuery(
    isbn,
    page,
    MAX_NUM_POSTS
  );
  const { data: morePosts, isPreviousData } = useBookPostsQuery(
    isbn,
    page + 1,
    MAX_NUM_POSTS
  );
  const hasMorePosts = morePosts?.length !== 0;

  if (!book) {
    if (isBookSuccess) {
      return <ErrorPage statusCode={404} />;
    }

    return <LoadingPage />;
  }

  const { googleBook } = book;

  const postsWithBookIncluded = posts?.map((post) => {
    return {
      ...post,
      book: book,
    };
  });

  const CourseBadges = () => (
    <Wrap>
      {book?.courses.map((course, i) => (
        <Link
          key={i}
          href={"/course/" + course.dept.abbreviation + "-" + course.code}
          passHref
        >
          <Button
            test-id="CourseButton"
            size="xs"
            colorScheme="teal"
            leftIcon={<Icon as={AcademicCapIcon} />}
          >
            {course.dept.abbreviation + " " + course.code}
          </Button>
        </Link>
      ))}
    </Wrap>
  );

  const bookInfo: React.ReactNode = (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{
        base: 4,
        md: 8,
      }}
    >
      <Box>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          background="tertiaryBackground"
          borderRadius="lg"
          overflow="hidden"
          height={{
            base: 56,
            md: "100%",
          }}
          width={{
            base: "100%",
            md: 56,
          }}
        >
          <Box width={32} height="100%" position="relative">
            <Image
              alt=""
              src={resolveImageUrl(book)}
              layout="fill"
              objectFit="contain"
              priority
            />
          </Box>
        </Flex>
      </Box>

      <Flex flex="auto" direction="column">
        <Flex direction="column">
          <Heading test-id="BookTitle" as="h1" size="lg" fontWeight="500" fontFamily="title">
            {resolveBookTitle(book)}
          </Heading>
          <Text test-id="BookAuthors" color="tertiaryText" fontWeight="semibold" mb="2">
            {googleBook?.authors?.join(", ")}
          </Text>

          <CourseBadges />

          <Box
            mt="4"
            mb="2"
            maxWidth={{
              base: "100%",
              md: "sm",
            }}
          >
            <HStack justify="space-between" color="tertiaryText">
              <HStack direction="row">
                <Icon as={OfficeBuildingIcon} />
                <Text> Publisher </Text>
              </HStack>
              <HStack>
                <Icon as={CalendarIcon} />
                <Text> Published </Text>
              </HStack>
            </HStack>
            <HStack justify="space-between">
              <Text test-id="Publisher">
                {googleBook?.publisher ?? "\u2013"}
              </Text>
              <Text test-id="PublishedDate">
                {googleBook?.publishedDate ?? "\u2013"}
              </Text>
            </HStack>
            <HStack justify="space-between" color="tertiaryText" mt="2">
              <HStack direction="row">
                <Icon as={ViewListIcon} transform={"rotate(90deg)"} />
                <Text> ISBN </Text>
              </HStack>
              <HStack>
                <Icon as={BookOpenIcon} />
                <Text> Page Count </Text>
              </HStack>
            </HStack>
            <HStack justify="space-between">
              <Text test-id="ISBN">
                {isbn && !Array.isArray(isbn) ? isbn : ""}
              </Text>
              <Text test-id="PageCount">
                {googleBook?.pageCount?.toString() ?? "\u2013"}
              </Text>
            </HStack>
          </Box>
        </Flex>

        <HStack mt="2">
          <Button
            test-id="CampusStoreButton"
            width={{
              base: "100%",
              sm: "min-content",
            }}
            size="xs"
            variant="outline"
            colorScheme="mcmaster"
            as="a"
            href={resolveCampusStoreLink(book)}
            target="_blank"
            rightIcon={<Icon as={ExternalLinkIcon} />}
          >
            Campus Store
          </Button>
          {googleBook && (
            <Button
              test-id="GoogleBookButton"
              width={{
                base: "100%",
                sm: "min-content",
              }}
              size="xs"
              variant="outline"
              colorScheme="blue"
              as="a"
              href={googleBook.infoLink}
              target="_blank"
              rightIcon={<Icon as={ExternalLinkIcon} />}
            >
              Google Books
            </Button>
          )}
        </HStack>
      </Flex>
    </Flex>
  );

  return (
    <>
      <Head>
        <title>{pageTitle(resolveBookTitle(book))}</title>
      </Head>
      <Layout extendedHeader={bookInfo}>
        {isLoadingPosts ? (
          <Flex width="100%" height="56" align="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : !posts || posts.length === 0 ? (
          <Text my="20" fontSize="lg" textAlign="center">
            No active listings found
          </Text>
        ) : (
          <>
            <Text
              fontFamily="title"
              fontWeight="500"
              fontSize="2xl"
              mt="10"
              mb="4"
            >
              Active Listings
            </Text>
            <PostCardGrid posts={postsWithBookIncluded ?? []} />
            {(page === 0
              ? posts.length === MAX_NUM_POSTS
              : posts.length !== 0) && (
              <PaginationButtons
                page={page}
                url={"/book/" + isbn}
                morePosts={hasMorePosts}
                isLoadingNextPage={isPreviousData}
              />
            )}
          </>
        )}

        {book.isCampusStoreBook && (
          <>
            <Divider
              mx="auto"
              my={{
                base: "12",
                md: "14",
              }}
              maxWidth="lg"
            />

            <VStack
              mb={{
                base: "14",
                md: "16",
              }}
              spacing="5"
            >
              <Text>Can&apos;t find this book being sold?</Text>
              <Button
                test-id="CampusStoreButton"
                colorScheme="teal"
                as="a"
                href={resolveCampusStoreLink(book)}
                target="_blank"
                rightIcon={<Icon as={ExternalLinkIcon} />}
              >
                Buy from Campus Store
                {book.campusStorePrice &&
                  ` for $${formatIntPrice(book.campusStorePrice)}`}
              </Button>
            </VStack>
          </>
        )}
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<BookPageProps> = async (
  context
) => {
  const isbn = context.params?.isbn;
  if (typeof isbn !== "string") return { notFound: true };

  const book = await getPopulatedBook(isbn);
  if (!book) return { notFound: true };

  return {
    props: {
      initialBook: book,
    },
    // Book should only change after an index
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Prerender book pages related to most recent posts
  const recentPosts = await prisma.post.findMany({
    take: 50,
    orderBy: {
      updatedAt: "desc",
    },
    distinct: ["bookId"],
    select: {
      book: {
        select: {
          isbn: true,
        },
      },
    },
  });

  const recentISBNs = recentPosts.map((post) => post.book.isbn);

  return {
    paths: recentISBNs.map((isbn) => ({ params: { isbn } })),
    fallback: true,
  };
};

export default BookPage;
