import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { TEXTBOOK_ASPECT_RATIO } from "@components/create-post-page/UploadTextbookCover";
import Layout from "@components/Layout";
import LoginModal from "@components/LoginModal";
import DeletePostForm from "@components/post-page/DeletePostForm";
import SafeInteractionTipsModal from "@components/SafeInteractionTipsModal";
import UserWithAvatar from "@components/UserWithAvatar";
import {
  BookOpenIcon,
  MailIcon,
  PencilAltIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import createTeamsContactUrl from "@lib/helpers/frontend/create-teams-contact-url";
import pageTitle from "@lib/helpers/frontend/page-title";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { timeSinceDateString } from "@lib/helpers/frontend/time-between-dates";
import { formatIntPrice } from "@lib/helpers/priceHelpers";
import { useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import { MAX_NUM_POSTS, PostCardGrid } from "@components/CardList";
import { useUserQuery } from "@lib/hooks/user";
import type { NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { parsePageString } from "@lib/helpers/frontend/parse-page-string";
import { PaginationButtons } from "@components/PaginationButtons";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id, page: pageString } = router.query;
  const page = parsePageString(pageString);
  const { data: post, isLoading: postIsLoading } = usePostQuery(id);
  const { data: book, isLoading: bookIsLoading } = useBookQuery(
    post?.book.isbn,
    page,
    MAX_NUM_POSTS
  );
  const { data: bookSecondData, isPreviousData } = useBookQuery(
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

  if (!post) {
    if (postIsLoading) return null;
    return <ErrorPage statusCode={404} />;
  }

  if (!book) {
    if (bookIsLoading) return null;
    return <ErrorPage statusCode={404} />;
  }

  const { posts } = book;

  const postsWithBookIncluded = posts
    .map((p) => {
      return {
        ...p,
        book: book,
      };
    })
    .filter((p) => post.id !== p.id);

  const timeSincePost = timeSinceDateString(new Date(post.createdAt));
  const postHasUser = "user" in post;
  const isPostOwnedByUser = postHasUser ? user?.id === post.user.id : false;
  const morePosts = bookSecondData ? bookSecondData.posts.length !== 0 : false;

  const ActionButtons = () => {
    if (isPostOwnedByUser) {
      return (
        <>
          <Button leftIcon={<Icon as={PencilAltIcon} />} size="sm">
            Edit Post
          </Button>
          <DeletePostForm post={post} size="sm" />
        </>
      );
    }

    return (
      <>
        <Button
          leftIcon={<Icon as={UsersIcon} />}
          colorScheme="microsoftTeams"
          size="sm"
          onClick={() => {
            if (postHasUser) {
              openTeamsSafetyModal();
            } else {
              openLoginModal();
            }
          }}
        >
          Microsoft Teams
        </Button>
        <Button
          leftIcon={<Icon as={MailIcon} />}
          colorScheme="blue"
          size="sm"
          onClick={() => {
            if (postHasUser) {
              openEmailSafetyModal();
            } else {
              openLoginModal();
            }
          }}
        >
          Email
        </Button>
      </>
    );
  };

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
            <Skeleton isLoaded={!bookIsLoading}>
              <Heading
                as="h1"
                size="lg"
                fontWeight="500"
                fontFamily="title"
                display="inline"
              >
                {book ? resolveBookTitle(book) : "Placeholder for Skeleton"}{" "}
                <Text
                  as="span"
                  ml="1"
                  color="accent"
                  fontFamily="body"
                  fontSize="0.9em"
                  fontWeight="semibold"
                >
                  ${formatIntPrice(post.price)}
                </Text>
              </Heading>
            </Skeleton>
          </HStack>
          <Link href={"/book/" + book?.isbn} passHref>
            <Button
              size="xs"
              mt="2"
              variant="outline"
              leftIcon={<Icon as={BookOpenIcon} />}
              colorScheme="teal"
            >
              Book details
            </Button>
          </Link>

          <Divider mt="5" mb="6" />

          <VStack
            width="min(100%, var(--chakra-sizes-lg))"
            maxWidth="xl"
            align="start"
            display="inline-flex"
          >
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
                <Text color="secondaryText" fontWeight="500">
                  {postHasUser && post.user.name
                    ? `${post.user.name}  posted ${timeSincePost} ago`
                    : `Posted ${timeSincePost} ago`}
                </Text>
              </HStack>
              <HStack>
                <ActionButtons />
              </HStack>
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
        {/* TODO: Add proper page title */}
        <title>{pageTitle()}</title>
      </Head>
      <Layout extendedHeader={postInfo}>
        <Text mt="10" fontSize="2xl">
          Other Active Listings For This Book
        </Text>
        <PostCardGrid posts={postsWithBookIncluded} />
        {(page === 0 ? posts.length === MAX_NUM_POSTS : posts.length !== 0) && (
          <PaginationButtons
            page={page}
            url={"/post/" + id}
            morePosts={morePosts}
            isLoadingNextPage={isPreviousData}
          />
        )}
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
              window.open(createTeamsContactUrl(post), "_blank")?.focus();
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

export default PostPage;
