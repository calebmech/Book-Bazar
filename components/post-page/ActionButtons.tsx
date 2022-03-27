import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import EditPostForm from "@components/edit-post/EditPostForm";
import DeletePostForm from "./DeletePostForm";
import { PostWithBook, PostWithBookWithUser } from "@lib/services/post";
import { MailIcon, UsersIcon } from "@heroicons/react/solid";

export interface ActionButtonProps {
  post: PostWithBook | PostWithBookWithUser;
  isPostOwnedByUser: boolean;
  postHasUser: boolean;
  openTeamsSafetyModal: () => void;
  openEmailSafetyModal: () => void;
  openLoginModal: () => void;
}

export default function ActionButtons({
  post,
  isPostOwnedByUser,
  postHasUser,
  openTeamsSafetyModal,
  openEmailSafetyModal,
  openLoginModal,
}: ActionButtonProps & ButtonProps) {
  if (isPostOwnedByUser) {
    return (
      <>
        <EditPostForm post={post} size="sm" />
        <DeletePostForm post={post} size="sm" />
      </>
    );
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={UsersIcon} />}
        colorScheme="microsoftTeams"
        size="sm"
        test-id="TeamsButton"
        onClick={() => {
          if (postHasUser) {
            openTeamsSafetyModal();
          } else {
            openLoginModal();
          }
        }}
      >
        Microsoft Teams
      </Button>
      <Button
        leftIcon={<Icon as={MailIcon} />}
        colorScheme="blue"
        size="sm"
        onClick={() => {
          if (postHasUser) {
            openEmailSafetyModal();
          } else {
            openLoginModal();
          }
        }}
      >
        Email
      </Button>
    </>
  );
}
