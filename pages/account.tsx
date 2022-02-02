import { Flex, Heading, Spacer, Text, VStack } from "@chakra-ui/react";
import DeleteAccountForm from "@components/account-page/DeleteAccountForm";
import EditImageWidget from "@components/account-page/EditImageWidget";
import UpdateNameForm from "@components/account-page/UpdateNameForm";
import Layout from "@components/Layout";
import LoginModal from "@components/LoginModal";
import { getCurrentUser } from "@lib/helpers/backend/user-helpers";
import pageTitle from "@lib/helpers/frontend/page-title";
import { CreateResponseObject } from "@lib/helpers/type-utilities";
import { User, useUserQuery } from "@lib/hooks/user";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

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
