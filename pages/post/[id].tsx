import { Badge, Box, Button, Flex, Heading, HStack, Image, List, Spacer, Text, VStack } from "@chakra-ui/react";
import { EmailIcon } from '@chakra-ui/icons'
import Layout from "@components/Layout";
import UserWithAvatar from "@components/UserWithAvatar";
import { useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PostCardList } from "@components/CardList";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = usePostQuery(id);
  const { data: book } = useBookQuery(post?.book.isbn);

  if (!post) {
    return null;
  }

  const otherPosts = () => book?.posts.filter((other) => other.id !== post.id)

  return (
    <Layout>
      <HStack alignItems='flex-start'>
        <Image 
          alt='pic-of-book' 
          src={post.imageUrl || ''} 
          maxW="200px"
        />

        <Spacer />

        <VStack alignItems='left' >
          <HStack alignItems='flex-start'>
            <Heading>
              {book?.name}
            </Heading>
            <Heading color='teal'>
              ${post.price}
            </Heading>
          </HStack>
          <HStack>
            <Text>
              Posted by
            </Text>
            <UserWithAvatar user={post.user} />
          </HStack>

          <Spacer/>

          <Text>
            {post.description}
          </Text>

          <Spacer/>

          <Text fontWeight='bold'>
            Contact Seller
          </Text>

          <HStack>
            <Button leftIcon={<EmailIcon />} colorScheme='messenger'>
              Email
            </Button>
            <Button colorScheme='purple'>
              Microsoft Teams
            </Button>
          </HStack>

        </VStack>
      </HStack>
      <PostCardList posts={otherPosts()} />
    </Layout>
  );
};

export default PostPage;