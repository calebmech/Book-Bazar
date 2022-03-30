import { Box, Button, Icon, Text, VStack } from "@chakra-ui/react";
import { LinkIcon, UserCircleIcon } from "@heroicons/react/solid";
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
              verticalAlign="text-bottom"
              variant="link"
              rightIcon={
                <Icon mb="-0.07rem" ml="-0.25rem" as={UserCircleIcon} />
              }
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
