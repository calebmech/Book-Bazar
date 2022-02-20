import { Button, HStack, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import EditPostModal from "../EditPostModal";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import PostCard from "../PostCard";
import { Post } from "@prisma/client";
import { usePostQuery } from "@lib/hooks/post";
import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";

type AccountPostCardProps = {
  post: Post;
  isLinkActive: boolean;
};

export default function AccountPostCard({
  post,
  isLinkActive,
}: AccountPostCardProps) {
  const { data: postsWithBookWithUser } = usePostQuery(post.id);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [editPostModalKey, setEditPostModalKey] = useState("");
  const handleEditPostClick = () => {
    // Reset edit post modal each time it is opened
    setEditPostModalKey(uuid());
    onOpen();
  };

  const card = postsWithBookWithUser ? (
    <Stack align={"center"}>
      <PostCard post={postsWithBookWithUser} isLinkActive={isLinkActive} />
      <HStack>
        <Button
          w="240px"
          colorScheme={"teal"}
          type={"button"}
          onClick={handleEditPostClick}
          leftIcon={<Icon as={PencilAltIcon} />}
        >
          Edit
        </Button>
        <Button
          w="240px"
          colorScheme={"red"}
          type={"button"}
          leftIcon={<Icon as={TrashIcon} />}
        >
          Delete
        </Button>
      </HStack>
      <EditPostModal
        key={editPostModalKey}
        isOpen={isOpen}
        onClose={onClose}
        post={postsWithBookWithUser}
      />
    </Stack>
  ) : (
    <></>
  );
  return card;
}
