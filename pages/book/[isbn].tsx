import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import Layout from "@components/Layout";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ExternalLinkIcon,
  OfficeBuildingIcon,
  ViewBoardsIcon,
} from "@heroicons/react/solid";
import pageTitle from "@lib/helpers/frontend/page-title";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { formatIntPrice } from "@lib/helpers/priceHelpers";
import { useBookQuery } from "@lib/hooks/book";
import { MAX_NUM_POSTS, PostCardGrid } from "@components/CardList";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { PaginationButtons } from "@components/PaginationButtons";

const BookPage: NextPage = () => {
  const router = useRouter();
  const { isbn, page: pageString } = router.query;
  var page: number;
  if (!pageString || Array.isArray(pageString)) {
    page = 0;
  } else {
    page = Number.parseInt(pageString);
  }
  const { data: book, isLoading } = useBookQuery(isbn, page, MAX_NUM_POSTS);
  const { data: bookSecondData } = useBookQuery(isbn, page + 1, MAX_NUM_POSTS);
  const morePosts = bookSecondData ? bookSecondData.posts.length !== 0 : false;

  if (!book) {
    if (isLoading) return null;
    return <ErrorPage statusCode={404} />;
  }
  const { googleBook, posts } = book;

  const postsWithBookIncluded = posts.map((post) => {
    return {
      ...post,
      book: book,
    };
  });

  const CourseBadges = () => (
    <Wrap>
      {book.courses.map((course, i) => (
        <Link
          key={i}
          href={"/course/" + course.dept.abbreviation + "-" + course.code}
          passHref
        >
          <Button
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
          <Heading as="h1" size="lg" fontWeight="500" fontFamily="title">
            {resolveBookTitle(book)}
          </Heading>
          <Text color="tertiaryText" fontWeight="semibold" mb="2">
            {googleBook?.authors?.join(", ")}
          </Text>

          <CourseBadges />

          <Box
            my="4"
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
                <Text> Published Date </Text>
              </HStack>
            </HStack>
            <HStack justify="space-between">
              <Text>{googleBook?.publisher ?? "\u2013"}</Text>
              <Text>{googleBook?.publishedDate ?? "\u2013"}</Text>
            </HStack>
            <HStack justify="space-between" color="tertiaryText" mt="2">
              <HStack direction="row">
                <Icon as={ViewBoardsIcon} />
                <Text> ISBN </Text>
              </HStack>
              <HStack>
                <Icon as={BookOpenIcon} />
                <Text> Page Count </Text>
              </HStack>
            </HStack>
            <HStack justify="space-between">
              <Text>{isbn && !Array.isArray(isbn) ? isbn : ""}</Text>
              <Text>{googleBook?.pageCount?.toString() ?? "\u2013"}</Text>
            </HStack>
          </Box>
        </Flex>
        {googleBook && (
          <Button
            width={{
              base: "100%",
              sm: "min-content",
            }}
            size="sm"
            variant="outline"
            colorScheme="teal"
            as="a"
            href={googleBook.infoLink}
            target="_blank"
            rightIcon={<Icon as={ExternalLinkIcon} />}
          >
            View on Google Books
          </Button>
        )}
      </Flex>
    </Flex>
  );

  return (
    <>
      <Head>
        <title>{pageTitle(resolveBookTitle(book))}</title>
      </Head>
      <Layout extendedHeader={bookInfo}>
        <PostCardGrid posts={postsWithBookIncluded} />
        {(page === 0 ? posts.length === MAX_NUM_POSTS : posts.length !== 0) && (
          <PaginationButtons
            page={page}
            url={"/book/" + isbn}
            morePosts={morePosts} 
            isPreviousData={false}          
          />
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
              <Text>Can&apos;t find your book being sold?</Text>
              <Button
                colorScheme="teal"
                as="a"
                href="https://textbooks.mcmaster.ca"
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

export default BookPage;
