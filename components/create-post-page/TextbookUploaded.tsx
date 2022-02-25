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
            Your textbook post is now live! Make sure to check your messages
            regularly for messages from potential buyers. You can modify your
            post or take it down at any time by going to your account page.
          </Text>
        </Container>
        <Container>
          <HStack direction="row" justify="end">
            <Box />
            <Spacer />
            <Box>
              <Link href="/account" passHref>
                <Button
                  as="a"
                  colorScheme="teal"
                  variant="ghost"
                  rightIcon={<Icon as={UserIcon} />}
                >
                  Go to my account page
                </Button>
              </Link>
            </Box>
          </HStack>
        </Container>
      </VStack>
    </Container>
  );
}
