import { Grid, GridItem } from "@chakra-ui/react";
import PostCard from "../PostCard";
import { Post } from "@prisma/client";
import { usePostQuery } from "@lib/hooks/post";
import DeletePostForm from "@components/post-page/DeletePostForm";
import EditPostForm from "@components/edit-post/EditPostForm";

type AccountPostCardProps = {
  post: Post;
  isLinkActive: boolean;
};

export default function AccountPostCard({
  post,
  isLinkActive,
}: AccountPostCardProps) {
  const { data: postsWithBookWithUser } = usePostQuery(post.id);

  const card = postsWithBookWithUser ? (
    <>
      <Grid templateColumns="repeat(2, 1fr)" rowGap={2} columnGap={1}>
        <GridItem colSpan={2}>
          <PostCard post={postsWithBookWithUser} isLinkActive={isLinkActive} />
        </GridItem>
        <GridItem colSpan={1}>
          <EditPostForm post={postsWithBookWithUser} width="100%" />
        </GridItem>
        <GridItem colSpan={1}>
          <DeletePostForm post={post} isAccountPage={true} width="100%" />
        </GridItem>
      </Grid>
    </>
  ) : (
    <></>
  );
  return card;
}
