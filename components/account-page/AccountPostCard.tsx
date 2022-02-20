import { Button, HStack, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import EditPostModal from "../EditPostModal";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import PostCard from "../PostCard";
import { Post } from "@prisma/client";
import { usePostQuery } from "@lib/hooks/post";
import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";
import DeletePostForm from "@components/post-page/DeletePostForm";

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
    <Stack align={"center"} paddingBottom={2}>
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
        <DeletePostForm post={post} />
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
