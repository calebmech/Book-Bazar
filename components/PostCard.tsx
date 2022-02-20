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
      as={isLinkActive ? "a" : "div"}
      cursor={isLinkActive ? "pointer" : "cursor"}
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
