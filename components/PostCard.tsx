import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { formatIntPrice } from "@lib/helpers/priceHelpers";
import { useBookQuery } from "@lib/hooks/book";
import { PostWithBookWithUser } from "@lib/services/post";
import Image from "next/image";
import Link from "next/link";
import { TEXTBOOK_ASPECT_RATIO } from "./create-post-page/UploadTextbookCover";
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
        base: "160px 1fr",
      }}
      templateRows={{
        base: "220px",
      }}
      templateAreas={{
        base: `'image info'`,
      }}
      background="secondaryBackground"
      overflow="hidden"
      borderRadius="lg"
      direction="row"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
    >
      <Box gridArea="image" height="220px" width="160px" position="relative">
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

  const card2 = (
    <Flex
      background="secondaryBackground"
      overflow="hidden"
      borderRadius="lg"
      direction="row"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      as={isLinkActive ? "a" : "div"}
    >
      <Flex
        flex="1"
        direction="row"
        justifyContent="center"
        alignItems="center"
        background="tertiaryBackground"
        overflow="hidden"
        position="relative"
      >
        <Image
          height={300}
          width={300 * TEXTBOOK_ASPECT_RATIO}
          src={imageUrl || resolveImageUrl(populatedBook)}
          alt="book-image"
        />
      </Flex>

      <Flex
        flex="2"
        direction="column"
        justify="space-between"
        fontSize="sm"
        p="4"
      >
        <Box mb="3">
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
          <Text color="secondaryText" noOfLines={3}>
            {description}
          </Text>
        </Box>
        <UserWithAvatar user={user} />
      </Flex>
    </Flex>
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
