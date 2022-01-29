import { Badge, Box, Button, Flex, HStack, Image, List, Spacer, Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import { useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = usePostQuery(id);
  const { data: book } = useBookQuery(post?.book.isbn);

  if (!post) {
    return null;
  }

  return (
    <Layout>
      {book?.name}
    </Layout>
  );
};

export default PostPage;