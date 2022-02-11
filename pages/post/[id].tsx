import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Image,
  Skeleton,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  PencilAltIcon,
  MailIcon,
  ChatIcon,
  BookOpenIcon,
} from "@heroicons/react/solid";
import ErrorPage from "next/error";
import Layout from "@components/Layout";
import UserWithAvatar from "@components/UserWithAvatar";
import { useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PostCardList } from "@components/CardList";
import { useUserQuery } from "@lib/hooks/user";
import DeletePostForm from "@components/post-page/DeletePostForm";
import { resolveImageUrl } from "@lib/helpers/frontend/resolve-image-url";
import { timeSinceDateString } from "@lib/helpers/frontend/time-between-dates";
import Link from "next/link";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post, isLoading: postIsLoading } = usePostQuery(id);
  const { data: book, isLoading: bookIsLoading } = useBookQuery(
    post?.book.isbn
  );
  const { user } = useUserQuery();

  if (!post) {
    if (postIsLoading) return null;
    return <ErrorPage statusCode={404} />;
  }

  const timeSincePost = timeSinceDateString(new Date(post.createdAt));
  const isPostOwnedByUser = post.user ? user?.id === post.user.id : false;
  const otherPostsForBook = book?.posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      return {
        ...p,
        book: book,
      };
    });

  var buttonText: string;
  var buttonFragment: React.ReactNode;
  if (isPostOwnedByUser) {
    buttonText = "Post Options";
    buttonFragment = (
      <>
        <Button leftIcon={<Icon as={PencilAltIcon} />} colorScheme="teal">
          Edit Post
        </Button>
        <DeletePostForm post={post} />
      </>
    );
  } else if (user) {
    const cannedMessage =
      "Hi " +
      post.user.name +
      '! I am interested in the book you posted on Book Bazar "' +
      post.book.name +
      '". \n' +
      window.location.href +
      "\nIs it still available?";
    const users = encodeURIComponent(post.user.email);
    const message = encodeURIComponent(cannedMessage);
    const parameters = `?users=${users}&message=${message}`;
    const teamsDeepLink = "https://teams.microsoft.com/l/chat/0/0" + parameters;

    buttonText = "Contact Seller";
    buttonFragment = (
      <>
        <ChakraLink
          href={teamsDeepLink}
          _hover={{ textDecoration: "none" }}
          isExternal
        >
          <Button
            leftIcon={<Icon as={ChatIcon} />}
            colorScheme="microsoftTeams"
          >
            Microsoft Teams
          </Button>
        </ChakraLink>
        <ChakraLink
          href={"mailto:" + post.user.email}
          _hover={{ textDecoration: "none" }}
          isExternal
        >
          <Button leftIcon={<Icon as={MailIcon} />} colorScheme="blue">
            Email
          </Button>
        </ChakraLink>
      </>
    );
  } else {
    buttonText = "Sign in to interact with the owner of this post.";
  }

  const postInfo = (
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
          w="100%"
          justifyContent="center"
          alignItems="center"
          background="tertiaryBackground"
          borderRadius="lg"
          overflow="hidden"
        >
          <Box >
            <Image
              alt="book-image"
              src={post.imageUrl || resolveImageUrl(book)}
              width="100%"
              height="100%"
              objectFit="contain"
              maxH="322px"
            />
          </Box>
        </Flex>
      </Box>

      <Flex gridArea="info" direction="column" justifyContent="space-between">
        <Box>
          <HStack fontSize="2xl" fontWeight="bold">
            <Skeleton isLoaded={!bookIsLoading}>
              <Text>{book?.name ?? "Placeholder for Skeleton"}</Text>
            </Skeleton>
            <Text color="teal">${post.price/100}</Text>
          </HStack>

          <HStack>
            <UserWithAvatar user={post.user} />
            <Text>Posted {timeSincePost} ago</Text>
            <Link href={"/book/" + book?.isbn} passHref>
              <Button
                size="xs"
                mt="2"
                leftIcon={<Icon as={BookOpenIcon} />}
                colorScheme="teal"
              >
                Book Page
              </Button>
            </Link>
          </HStack>
          {/* max ~390 characters for description*/}
          <Text mt="2" noOfLines={6}>{post.description}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">{buttonText}</Text>
          <HStack>{buttonFragment}</HStack>
        </Box>
      </Flex>
    </Grid>
  );

  return (
    <Layout extendedHeader={postInfo}>
      <PostCardList posts={otherPostsForBook ?? []} isLinkActive />
    </Layout>
  );
};

export default PostPage;
