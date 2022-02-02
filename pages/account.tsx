import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  StackProps,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";
import Layout from "@components/Layout";
import LoginModal from "@components/LoginModal";
import { getCurrentUser } from "@lib/helpers/backend/user-helpers";
import pageTitle from "@lib/helpers/frontend/page-title";
import { CreateResponseObject } from "@lib/helpers/type-utilities";
import {
  useDeleteUserMutation,
  User,
  useUpdateUserMutation,
  useUserQuery,
} from "@lib/hooks/user";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

const PAGE_TITLE = pageTitle("Account");

interface AccountPageProps {
  initialUser: User | null;
}

const AccountPage: NextPage<AccountPageProps> = ({ initialUser }) => {
  const { user } = useUserQuery(initialUser ?? undefined);

  if (!user) {
    return (
      <>
        <Head>
          <title>{PAGE_TITLE}</title>
        </Head>
        <Layout>
          <LoginModal
            isOpen={true}
            onClose={() => {}}
            message="To access the account page you must be signed in. Please login with your MacID below."
          />
        </Layout>
      </>
    );
  }

  const PageHeader = (
    <Flex
      direction={{ base: "column", md: "row" }}
      mt="12"
      mb="6"
      gap={{ base: "8", md: "16" }}
      align="start"
    >
      <EditImageWidget user={user} display={{ base: "none", md: "initial" }} />
      <VStack align="start" width="100%">
        <Heading as="h1" size="lg" fontWeight="semibold" fontFamily="title">
          Your Account
        </Heading>
        <Text color="tertiaryText" fontWeight="semibold">
          {user.email}
          <Text
            as="span"
            display="block"
            fontSize="xs"
            color="captionText"
            aria-label="User ID"
          >
            ({user.id})
          </Text>
        </Text>

        <EditImageWidget user={user} display={{ md: "none" }} pt="4" />

        <Flex
          direction={{ base: "column", md: "row" }}
          pt="5"
          align="start"
          gap={{ base: "6", lg: "12" }}
          width="100%"
        >
          <UpdateNameForm user={user} />
          <DeleteAccountForm user={user} />
        </Flex>
      </VStack>
    </Flex>
  );

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
      </Head>
      <Layout extendedHeader={PageHeader}>
        {/* TODO: Allow editing and deleting of posts */}
        <Spacer height="lg" />
      </Layout>
    </>
  );
};

function EditImageWidget({ user, ...props }: { user: User } & StackProps) {
  const mutation = useUpdateUserMutation();

  const handleImageSubmit = (image: Blob) => {
    return mutation.mutateAsync({
      id: user.id,
      updateUserRequest: { image },
    });
  };

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imageModalKey, setImageModalKey] = useState("");
  const handleEditImage = () => {
    // Reset login modal each time it is opened
    setImageModalKey(uuid());
    onOpen();
  };

  return (
    <VStack {...props} textAlign="center">
      <ImageUploadModal
        key={imageModalKey}
        isOpen={isOpen}
        onClose={onClose}
        shape="round"
        aspectRatio={1}
        onUpload={handleImageSubmit}
      />
      <Box
        borderRadius="full"
        overflow="hidden"
        width={128}
        height={128}
        margin="auto"
        mb={1}
      >
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            width={128}
            height={128}
            alt="Profile picture"
          />
        ) : (
          <Avatar size="2xl" />
        )}
      </Box>
      <Button
        size="sm"
        variant="link"
        onClick={handleEditImage}
        leftIcon={<EditIcon />}
      >
        Edit image
      </Button>
    </VStack>
  );
}

function UpdateNameForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || "");

  const mutation = useUpdateUserMutation();

  const handleNameSubmit = (event: FormEvent) => {
    mutation.mutate({
      id: user.id,
      updateUserRequest: { name: name.trim() },
    });
    event.preventDefault();
  };

  return (
    <form onSubmit={handleNameSubmit} style={{ flex: "auto" }}>
      <HStack width="100%">
        <FormControl>
          <FormLabel htmlFor="name">Full name</FormLabel>
          <HStack>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              width="auto"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button
              type="submit"
              disabled={name.trim().length === 0}
              isLoading={mutation.isLoading}
            >
              Update
            </Button>
          </HStack>
          <FormHelperText>
            This will be displayed on posts you make
          </FormHelperText>
        </FormControl>
      </HStack>
    </form>
  );
}

function DeleteAccountForm({ user }: { user: User }) {
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
          leftIcon={<DeleteIcon />}
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

export const getServerSideProps: GetServerSideProps<AccountPageProps> = async ({
  req,
  res,
}) => {
  const user = await getCurrentUser(req, res);

  return {
    props: {
      initialUser: CreateResponseObject(user),
    },
  };
};

export default AccountPage;
