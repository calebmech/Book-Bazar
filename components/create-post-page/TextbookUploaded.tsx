import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { UserIcon } from "@heroicons/react/solid";
import { PostWithBookWithUser } from "@lib/services/post";
import Link from "next/link";
import PostCard from "../PostCard";

interface Props {
  post: PostWithBookWithUser;
}

export default function TextbookUploaded({ post }: Props) {
  return (
    <Container maxWidth="container.md">
      <VStack spacing="3">
        <PostCard post={post} isLinkActive={true} />
        <Container textAlign="left">
          <Text>
            Make sure to regularly check for messages from potential buyers.
          </Text>
          <Text>
            You can modify your post or take it down at any time by going to
            your{" "}
            <Link href="/account" passHref>
              <Button
                as="a"
                colorScheme="teal"
                variant="link"
                // leftIcon={<Icon as={UserIcon} />}
              >
                account page
              </Button>
            </Link>
            .
          </Text>
        </Container>
        <Container textAlign="right"></Container>
      </VStack>
    </Container>
  );
}
