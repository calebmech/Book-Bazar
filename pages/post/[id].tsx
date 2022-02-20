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
import { PostCardList } from "@components/CardList";
import { TEXTBOOK_ASPECT_RATIO } from "@components/create-post-page/UploadTextbookCover";
import Layout from "@components/Layout";
import LoginModal from "@components/LoginModal";
import DeletePostForm from "@components/post-page/DeletePostForm";
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
import { useUserQuery } from "@lib/hooks/user";
import type { NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post, isLoading: postIsLoading } = usePostQuery(id);
  const { data: book, isLoading: bookIsLoading } = useBookQuery(
    post?.book.isbn
  );
  const { user } = useUserQuery();

  const {
    onOpen: openLoginModal,
    isOpen: isLoginModalOpen,
    onClose: onLoginModalClose,
  } = useDisclosure();

  if (!post) {
    if (postIsLoading) return null;
    return <ErrorPage statusCode={404} />;
  }

  const timeSincePost = timeSinceDateString(new Date(post.createdAt));
  const postHasUser = "user" in post;
  const isPostOwnedByUser = postHasUser ? user?.id === post.user.id : false;
  const otherPostsForBook = book?.posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      return {
        ...p,
        book: book,
      };
    });

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
              window.open(createTeamsContactUrl(post), "_blank")?.focus();
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
              window.open("mailto:" + post.user.email);
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
                background="tertiaryBackground"
                padding="6"
                width="100%"
                border="1px"
                borderColor="tertiaryBackgroundBorder"
                borderRadius="lg"
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
        <PostCardList
          posts={otherPostsForBook ?? []}
          isLinkActive
          itemName="Similar Post"
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={onLoginModalClose}
          message="To contact the seller please login with your MacID below."
        />
      </Layout>
    </>
  );
};

export default PostPage;
