import { Box, Flex, Grid, Skeleton, Text } from "@chakra-ui/react";
import { resolveImageUrl } from "@lib/helpers/frontend/resolve-book-data";
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
    <Grid
      templateColumns={{
        base: "160px minmax(0, 1fr)",
      }}
      templateRows={{
        base: "220px",
      }}
      templateAreas={{
        base: `'image info'`,
      }}
      width="100%"
      minW="340px"
      background="secondaryBackground"
      overflow="hidden"
      borderRadius="lg"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
    >
      <Box gridArea="image" height="220px" width="165px" position="relative">
        <Image
          layout="fill"
          src={imageUrl || resolveImageUrl(populatedBook)}
          alt="book-image"
        />
      </Box>

      <Flex
        gridArea="info"
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
            ${price / 100}
          </Text>
          <Text color="secondaryText" noOfLines={3}>
            {description}
          </Text>
        </Box>
        <UserWithAvatar user={user} />
      </Flex>
    </Grid>
  );

  if (isLinkActive) {
    return (
      <Link href={"/post/" + id} passHref>
        {card}
      </Link>
    );
  }
  return card;
}
