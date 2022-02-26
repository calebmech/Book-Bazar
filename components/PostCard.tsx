import { Box, Flex, Grid, Skeleton, Text } from "@chakra-ui/react";
import { resolveBookTitle, resolveImageUrl } from "@lib/helpers/frontend/resolve-book-data";
import { formatIntPrice } from "@lib/helpers/priceHelpers";
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
        base: "120px minmax(0, 1fr)",
        sm: "165px minmax(0, 1fr)",
      }}
      templateRows={{
        base: "160px",
        sm: "220px",
      }}
      templateAreas="'image info'"
      background="secondaryBackground"
      overflow="hidden"
      borderRadius="lg"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
    >
      <Box
        height={{ base: "160px", sm: "220px" }}
        width={{ base: "120px", sm: "165px" }}
        gridArea="image"
        position="relative"
        display="flex"
      >
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
        p={{ base: "2", sm: "4" }}
      >
        <Box >
          <Skeleton isLoaded={!isBookLoading}>
            <Text fontSize="lg" fontWeight="semibold" isTruncated>
              {resolveBookTitle(populatedBook ?? book)}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!isBookLoading}>
            <Text color="secondaryText" isTruncated>
              {authors}
            </Text>
          </Skeleton>
          <Text my="1" fontWeight="bold" fontSize="xl">
            ${formatIntPrice(price)}
          </Text>
          <Text color="secondaryText" noOfLines={{ base: 1, sm: 3 }}>
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
