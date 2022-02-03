import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { useDeleteUserMutation, User } from "@lib/hooks/user";
import { useRef } from "react";

export default function DeleteAccountForm({ user }: { user: User }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef(null);

  const mutation = useDeleteUserMutation();

  const handleDeleteSubmit = () => {
    mutation.mutate(user.id);
  };

  return (
    <>
      <FormControl flex="auto">
        <FormLabel htmlFor="email">Account Removal</FormLabel>
        <Button
          onClick={() => onOpen()}
          colorScheme="red"
          leftIcon={<Icon as={TrashIcon} />}
        >
          Delete account
        </Button>
      </FormControl>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              {!mutation.error
                ? "Are you sure? All of your posts and account data will be irreversibly deleted."
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
