import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { useDeletePostMutation } from "@lib/hooks/post";
import { Post } from "@prisma/client";
import { useRef } from "react";

export interface DeletPostFormProps {
  post: Post;
  buttonWidth?: string;
}

export default function DeletePostForm({
  post,
  buttonWidth,
}: DeletPostFormProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef(null);

  const mutation = useDeletePostMutation(post.id);

  const handleDeleteSubmit = () => {
    mutation.mutate();
  };

  return (
    <>
      <Button
        onClick={() => onOpen()}
        colorScheme="red"
        leftIcon={<Icon as={TrashIcon} />}
        width={buttonWidth}
      >
        Delete post
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              {!mutation.error
                ? "Are you sure you want to delete this post?"
                : "An error occurred, please try again."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => onClose()}
                isDisabled={mutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteSubmit}
                isLoading={mutation.isLoading}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
