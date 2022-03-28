import { Box, Button, Icon, Text, VStack } from "@chakra-ui/react";
import { LinkIcon } from "@heroicons/react/solid";
import { PostWithBookWithUser } from "@lib/services/post";
import Link from "next/link";
import PostCard from "../PostCard";

interface Props {
  post: PostWithBookWithUser;
}

export default function TextbookUploaded({ post }: Props) {
  return (
    <Box maxWidth="md" margin="auto">
      <PostCard post={post} isLinkActive={true} />
      <VStack mt="6" spacing="3">
        <Text>
          Make sure to regularly check for messages from potential buyers.
        </Text>
        <Text>
          You can modify your post or take it down at any time by going to your{" "}
          <Link href="/account" passHref>
            <Button
              as="a"
              colorScheme="teal"
              variant="link"
              rightIcon={<Icon as={LinkIcon} />}
            >
              account page
            </Button>
          </Link>
          .
        </Text>
      </VStack>
    </Box>
  );
}
