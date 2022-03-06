import { Button, ButtonProps, Icon, useDisclosure } from "@chakra-ui/react";
import EditPostModal from "./EditPostModal";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { PencilAltIcon } from "@heroicons/react/outline";
import { PostWithBook, PostWithBookWithUser } from "@lib/services/post";

export default function EditPostForm({
  post,
  ...props
}: { post: PostWithBook | PostWithBookWithUser } & ButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [editPostModalKey, setEditPostModalKey] = useState("");
  const handleEditPostClick = () => {
    // Reset edit post modal each time it is opened
    setEditPostModalKey(uuid());
    onOpen();
  };

  return (
    <>
      <Button
        colorScheme={"teal"}
        type={"button"}
        onClick={handleEditPostClick}
        leftIcon={<Icon as={PencilAltIcon} />}
        {...props}
      >
        Edit
      </Button>
      <EditPostModal
        key={editPostModalKey}
        isOpen={isOpen}
        onClose={onClose}
        post={post}
      />
    </>
  );
}
