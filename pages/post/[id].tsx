import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  PencilAltIcon,
  TrashIcon,
  MailIcon,
  ChatIcon,
} from "@heroicons/react/solid";
import Layout from "@components/Layout";
import UserWithAvatar from "@components/UserWithAvatar";
import { useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PostCardList } from "@components/CardList";
import { useUserQuery } from "@lib/hooks/user";
import moment from "moment";
import Link from "next/link";
import DeletePostForm from "@components/post-page/DeletePostForm";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = usePostQuery(id);
  const { data: book } = useBookQuery(post?.book.isbn);
  const { user } = useUserQuery();

  if (!post) {
    return null;
  }

  const time = moment(post.createdAt);

  const isPostOwnedByUser = post.user ? user?.id === post.user.id : false;

  var buttonText: string;
  var buttonFragment: React.ReactNode;
  if (isPostOwnedByUser) {
    buttonText = "";
    buttonFragment = (
      <>
        <Button leftIcon={<Icon as={PencilAltIcon} />} colorScheme="teal">
          Edit Post
        </Button>
        <DeletePostForm post={post} />
      </>
    );
  } else if (user) {
    buttonText = "Post Options";
    buttonFragment = (
      <>
        <Button
          leftIcon={<Icon as={MailIcon} />}
          colorScheme="messenger"
          onClick={() => window.open("mailto:" + post.user?.email)}
        >
          Email
        </Button>
        <Button
          leftIcon={<Icon as={ChatIcon} />}
          colorScheme="teal"
          onClick={() =>
            window.open(
              "https://teams.microsoft.com/l/chat/0/0?users=" + post.user?.email
            )
          }
        >
          Microsoft Teams
        </Button>
      </>
    );
  } else {
    buttonText = "Sign in to interact with the owner of this post.";
  }

  const headerSection = (
    <Grid
      width="100%"
      templateColumns={{
        base: "300px 1fr",
      }}
      templateRows={{
        base: "400px",
      }}
      templateAreas={{
        sm: `'image image' 'info info'`,
        md: `'image info'`,
      }}
      gap={8}
    >
      <Flex gridArea="image" direction="row" justifyContent="center">
        <Box
          shadow="md"
          h="400px"
          w="300px"
          borderRadius="md"
          overflow="hidden"
        >
          <Image
            alt="book-image"
            src={post.imageUrl ?? 'test'}
            width="300px"
            height="400px"
          />
        </Box>
      </Flex>

      <Flex
        gridArea="info"
        direction="column"
        justifyContent="space-between"
        minH="200px"
      >
        <Box>
          <HStack alignItems="flex-start">
            <Heading>{book?.name}</Heading>
            <Heading color="teal">${post.price}</Heading>
          </HStack>

          <HStack>
            <UserWithAvatar user={post.user} isYou={isPostOwnedByUser} />
            <Text>Posted {time.fromNow()}</Text>
            {moment().diff(time, "minutes") < 30 && (
              <Badge colorScheme="teal">New</Badge>
            )}
          </HStack>

          <Text mt="2">{post.description}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">{buttonText}</Text>
          <HStack>{buttonFragment}</HStack>
        </Box>
      </Flex>
    </Grid>
  );

  const otherPosts = book?.posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      return {
        ...p,
        book: book,
      };
    });

  return (
    <Layout extendedHeader={headerSection}>
      <PostCardList posts={otherPosts ?? []} isLinkActive />
    </Layout>
  );
};

export default PostPage;
