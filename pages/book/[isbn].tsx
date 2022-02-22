import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Text,
  Wrap,
} from "@chakra-ui/react";
import {
  OfficeBuildingIcon,
  CalendarIcon,
  BookOpenIcon,
  ViewBoardsIcon,
  AcademicCapIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import { PostCardList } from "@components/CardList";
import Layout from "@components/Layout";
import { useBookQuery } from "@lib/hooks/book";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { resolveImageUrl } from "@lib/helpers/frontend/resolve-book-data";

const BookPage: NextPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const { data: book } = useBookQuery(isbn);
  if (!book) {
    return null;
  }
  const { name, googleBook, posts } = book;

  const postsWithBookIncluded = posts.map((post) => {
    return {
      ...post,
      book: book,
    };
  });

  const courseBadges: React.ReactFragment = (
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
            {course.dept.abbreviation + "-" + course.code}
          </Button>
        </Link>
      ))}
    </Wrap>
  );

  const bookInfo: React.ReactNode = (
    <Grid
      width="100%"
      templateColumns={{
        base: "256px 1fr",
      }}
      templateRows={{
        base: "300px",
      }}
      templateAreas={{
        base: `'image image' 'info info'`,
        md: `'image info'`,
      }}
      gap={{
        base: 4,
        md: 8,
      }}
    >
      <Box gridArea="image">
        <Flex
          direction="row"
          h="100%"
          justifyContent="center"
          alignItems="center"
          background="tertiaryBackground"
          borderRadius="lg"
        >
          <Box width="128px" height="100%" position="relative">
            <Image
              alt="book-image"
              src={resolveImageUrl(book)}
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </Flex>
      </Box>

      <Flex gridArea="info" direction="column" justify="space-between">
        <Flex direction="column">
          <Text fontSize="2xl" fontWeight="bold">
            {name}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="secondaryText">
            {googleBook?.authors?.join(", ")}
          </Text>

          {courseBadges}

          <Box mt="2">
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
            <HStack justify="space-between" fontSize="xl" fontStyle="bold">
              <Text>{googleBook?.publisher ?? "-"}</Text>
              <Text>{googleBook?.publishedDate ?? "-"}</Text>
            </HStack>
            <HStack justify="space-between" color="tertiaryText">
              <HStack direction="row">
                <Icon as={ViewBoardsIcon} />
                <Text> ISBN </Text>
              </HStack>
              <HStack>
                <Icon as={BookOpenIcon} />
                <Text> Page Count </Text>
              </HStack>
            </HStack>
            <HStack justify="space-between" fontSize="xl" fontStyle="bold">
              <Text>{isbn && !Array.isArray(isbn) ? isbn : ""}</Text>
              <Text>{googleBook?.pageCount?.toString() ?? "-"}</Text>
            </HStack>
          </Box>
        </Flex>
        {googleBook && (
          <Button
            mt="1"
            onClick={() => window.open(googleBook.infoLink)}
            rightIcon={<Icon as={ExternalLinkIcon} />}
          >
            View On Google Books
          </Button>
        )}
      </Flex>
    </Grid>
  );

  return (
    <Layout extendedHeader={bookInfo}>
      <PostCardList posts={postsWithBookIncluded} isLinkActive={true} />
    </Layout>
  );
};

export default BookPage;
