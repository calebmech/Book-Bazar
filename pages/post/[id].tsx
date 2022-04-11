import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { TEXTBOOK_ASPECT_RATIO } from "@components/create-post-page/UploadTextbookCover";
import Layout from "@components/Layout";
import LoadingPage from "@components/LoadingPage";
import LoginModal from "@components/LoginModal";
import SafeInteractionTipsModal from "@components/SafeInteractionTipsModal";
import UserWithAvatar from "@components/UserWithAvatar";
import { BookOpenIcon, MailIcon, UsersIcon } from "@heroicons/react/solid";
import createTeamsContactUrl from "@lib/helpers/frontend/create-teams-contact-url";
import pageTitle from "@lib/helpers/frontend/page-title";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { timeSinceDateString } from "@lib/helpers/frontend/time-between-dates";
import { formatIntPrice } from "@lib/helpers/priceHelpers";
import { createResponseObject } from "@lib/helpers/type-utilities";
import { useBookPostsQuery, useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import { PostCardGrid } from "@components/CardList";
import { useUserQuery } from "@lib/hooks/user";
import { getPopulatedBook, PopulatedBook } from "@lib/services/book";
import { getPost, PostWithBook } from "@lib/services/post";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { parsePageString } from "@lib/helpers/frontend/parse-page-string";
import { PaginationButtons } from "@components/PaginationButtons";
import ActionButtons from "@components/post-page/ActionButtons";
import { MAX_NUM_POSTS } from "@lib/helpers/constants";

interface PostPageProps {
  initialPost: PostWithBook;
  initialBook: PopulatedBook;
}

const PostPage: NextPage<Partial<PostPageProps>> = ({
  initialPost,
  initialBook,
}) => {
  const router = useRouter();
  const { id, page: pageString } = router.query;
  const page = parsePageString(pageString);

  const { data: post, isSuccess: isPostSuccess } = usePostQuery(
    id,
    initialPost
  );
  const { data: book, isSuccess: isBookSuccess } = useBookQuery(
    post?.book.isbn,
    { initialData: initialBook }
  );
  const { data: posts, isLoading: isLoadingPosts } = useBookPostsQuery(
    post?.book.isbn,
    page,
    MAX_NUM_POSTS
  );
  const { data: bookSecondData, isPreviousData } = useBookPostsQuery(
    post?.book.isbn,
    page + 1,
    MAX_NUM_POSTS
  );
  const { user } = useUserQuery();

  const {
    onOpen: openLoginModal,
    isOpen: isLoginModalOpen,
    onClose: onLoginModalClose,
  } = useDisclosure();
  const {
    isOpen: isTeamsSafetyModalOpen,
    onClose: onTeamsSafetyModalClose,
    onOpen: openTeamsSafetyModal,
  } = useDisclosure();
  const {
    isOpen: isEmailSafetyModalOpen,
    onClose: onEmailSafetyModalClose,
    onOpen: openEmailSafetyModal,
  } = useDisclosure();

  if (!post || !book) {
    if (isPostSuccess && isBookSuccess) {
      return <ErrorPage statusCode={404} />;
    }

    return <LoadingPage />;
  }

  const timeSincePost = timeSinceDateString(new Date(post.createdAt));
  const postHasUser = "user" in post;
  const postUserDataLoading = user && !postHasUser;
  const isPostOwnedByUser = postHasUser ? user?.id === post.user.id : false;
  const hasMorePosts = bookSecondData?.length !== 0;

  const similarPosts = posts
    ?.filter((p) => p.id !== post.id)
    .map((p) => {
      return {
        ...p,
        book: book,
      };
    });

  const postInfo = (
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
        >
          <Image
            alt="post-image"
            src={post.imageUrl || resolveImageUrl(book)}
            height={300}
            width={300 * TEXTBOOK_ASPECT_RATIO}
            layout="intrinsic"
          />
        </Flex>
      </Box>

      <Flex flex="auto" direction="column" justifyContent="space-between">
        <Box>
          <HStack spacing="3" mb="1" align="start">
            <Heading
              as="h1"
              size="lg"
              fontWeight="500"
              fontFamily="title"
              display="inline"
              test-id="BookTitle"
            >
              {book ? resolveBookTitle(book) : "Placeholder for Skeleton"}{" "}
              <Text
                as="span"
                ml="1"
                color="accent"
                fontFamily="body"
                fontSize="0.9em"
                fontWeight="semibold"
                test-id="PostPrice"
              >
                ${formatIntPrice(post.price)}
              </Text>
            </Heading>
          </HStack>
          <Link href={"/book/" + book?.isbn} passHref>
            <Button
              size="xs"
              mt="2"
              variant="outline"
              leftIcon={<Icon as={BookOpenIcon} />}
              colorScheme="teal"
              test-id="BookButton"
            >
              Book details
            </Button>
          </Link>

          <Divider mt="5" mb="6" />

          <VStack maxWidth="xl" align="start" display="inline-flex">
            <HStack
              width="100%"
              justifyContent="space-between"
              align="start"
              flexWrap="wrap"
              gap="3"
              spacing="0"
              mb="3"
            >
              <HStack mr="2" spacing="3">
                <UserWithAvatar
                  user={postHasUser ? post.user : null}
                  hideName
                />
                <Skeleton isLoaded={!postUserDataLoading}>
                  <Text
                    color="secondaryText"
                    fontWeight="500"
                    test-id="UserText"
                  >
                    {postHasUser && post.user.name
                      ? `${post.user.name} posted ${timeSincePost}`
                      : `Posted ${timeSincePost}`}
                  </Text>
                </Skeleton>
              </HStack>
              <Skeleton isLoaded={!postUserDataLoading}>
                <HStack>
                  <ActionButtons
                    post={post}
                    isPostOwnedByUser={isPostOwnedByUser}
                    postHasUser={postHasUser}
                    openTeamsSafetyModal={openTeamsSafetyModal}
                    openEmailSafetyModal={openEmailSafetyModal}
                    openLoginModal={openLoginModal}
                  />
                </HStack>
              </Skeleton>
            </HStack>
            {/* max ~390 characters for description*/}
            {post.description && (
              <Text
                noOfLines={6}
                padding="6"
                width="100%"
                border="1px"
                borderRadius="lg"
                background="gray.100"
                borderColor="gray.200"
                _dark={{
                  background: "gray.800",
                  borderColor: "whiteAlpha.300",
                }}
                test-id="PostDescription"
              >
                {post.description}
              </Text>
            )}
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );

  return (
    <>
      <Head>
        <title>
          {pageTitle(
            `${resolveBookTitle(book)} ($${formatIntPrice(post.price)})`
          )}
        </title>
      </Head>
      <Layout extendedHeader={postInfo}>
        <Text fontFamily="title" fontWeight="500" fontSize="2xl" mt="10" mb="4">
          Similar Posts
        </Text>
        {isLoadingPosts ? (
          <Flex width="100%" height="56" align="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : !similarPosts || similarPosts.length === 0 ? (
          <Text fontSize="lg" color="secondaryText">
            No similar posts found
          </Text>
        ) : (
          <>
            <PostCardGrid posts={similarPosts} />
            {(page === 0
              ? posts?.length === MAX_NUM_POSTS
              : posts?.length !== 0) && (
              <PaginationButtons
                page={page}
                url={"/post/" + id}
                morePosts={hasMorePosts}
                isLoadingNextPage={isPreviousData}
              />
            )}
          </>
        )}

        <Spacer height="6" />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={onLoginModalClose}
          message="To contact the seller please login with your MacID below."
        />
        <SafeInteractionTipsModal
          isOpen={isTeamsSafetyModalOpen}
          onClose={onTeamsSafetyModalClose}
          onAccept={() => {
            if (postHasUser) {
              window.open(createTeamsContactUrl(post, book), "_blank")?.focus();
            }
          }}
        />
        <SafeInteractionTipsModal
          isOpen={isEmailSafetyModalOpen}
          onClose={onEmailSafetyModalClose}
          onAccept={() => {
            if (postHasUser) {
              window.open("mailto:" + post.user.email);
            }
          }}
        />
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;
  if (typeof id !== "string") return { notFound: true };

  const post = await getPost(id, false);
  if (!post) return { notFound: true };

  const book = await getPopulatedBook(post?.book.isbn);
  if (!book) return { notFound: true };

  return {
    props: {
      initialPost: createResponseObject(post),
      initialBook: book,
    },
    // Page is force-revalidated by API on update/delete
    // All other static data is only updated after an index
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default PostPage;
