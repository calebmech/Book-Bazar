import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import { resolveImageUrl } from "@lib/helpers/frontend/resolve-image-url";
import { useBookQuery } from "@lib/hooks/book";
import { PostWithBookWithUser } from "@lib/services/post";
import Image from "next/image";
import Link from "next/link";
import UserWithAvatar from "./UserWithAvatar";

type PostCardProps = {
  post: PostWithBookWithUser;
  isLinkActive: boolean;
};

export default function PostCard({ post, isLinkActive }: PostCardProps) {
  const { id, price, description, user, book, imageUrl } = post;
  const { isLoading: isBookLoading, data: populatedBook } = useBookQuery(
    book.isbn
  );
  const authors = populatedBook?.googleBook?.authors?.join(", ") || "-";

  const card = (
    <Flex
      w="490px"
      background="secondaryBackground"
      overflow="hidden"
      borderRadius="lg"
      mb="3"
      mx="3"
      direction="row"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
    >
      <Image
        height="220px"
        width="160px"
        src={imageUrl || resolveImageUrl(populatedBook)}
        alt="book-image"
      />

      <Flex
        w="330px"
        direction="column"
        justify="space-between"
        fontSize="sm"
        p="4"
      >
        <Box>
          <Skeleton isLoaded={!isBookLoading}>
            <Text fontWeight="semibold" isTruncated>
              {book.name}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!isBookLoading}>
            <Text mt="1" color="secondaryText" isTruncated>
              {authors}
            </Text>
          </Skeleton>
          <Text fontWeight="bold" fontSize="xl">
            ${price}
          </Text>
          <Text color="secondaryText" noOfLines={3}>
            {description}
          </Text>
        </Box>
        <UserWithAvatar user={user} />
      </Flex>
    </Flex>
  );

  if (isLinkActive) {
    return <Link href={"/post/" + id}>{card}</Link>;
  }
  return card;
}
