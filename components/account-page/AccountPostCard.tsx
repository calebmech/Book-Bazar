import { Button, Grid, GridItem, Icon, useDisclosure } from "@chakra-ui/react";
import EditPostModal from "../EditPostModal";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import PostCard from "../PostCard";
import { Post } from "@prisma/client";
import { usePostQuery } from "@lib/hooks/post";
import { PencilAltIcon } from "@heroicons/react/outline";
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
    <>
      <Grid templateColumns="repeat(2, 1fr)" rowGap={1} columnGap={1}>
        <GridItem colSpan={2}>
          <PostCard post={postsWithBookWithUser} isLinkActive={isLinkActive} />
        </GridItem>
        <GridItem colSpan={1}>
          <Button
            colorScheme={"teal"}
            type={"button"}
            onClick={handleEditPostClick}
            leftIcon={<Icon as={PencilAltIcon} />}
            width="100%"
          >
            Edit
          </Button>
        </GridItem>
        <GridItem colSpan={1}>
          <DeletePostForm post={post} isAccountPage={true} />
        </GridItem>
        <EditPostModal
          key={editPostModalKey}
          isOpen={isOpen}
          onClose={onClose}
          post={postsWithBookWithUser}
        />
      </Grid>
    </>
  ) : (
    <></>
  );
  return card;
}
