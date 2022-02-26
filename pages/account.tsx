import { Divider, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import DeleteAccountForm from "@components/account-page/DeleteAccountForm";
import EditImageWidget from "@components/account-page/EditImageWidget";
import UpdateNameForm from "@components/account-page/UpdateNameForm";
import Layout from "@components/Layout";
import LoadingPage from "@components/LoadingPage";
import LoginModal from "@components/LoginModal";
import pageTitle from "@lib/helpers/frontend/page-title";
import { useUserQuery } from "@lib/hooks/user";
import { NextPage } from "next";
import Head from "next/head";
import { Post } from "@prisma/client";
import { AccountPostCardList } from "@components/CardList";
import { useUserIdQuery } from "@lib/hooks/user";

const PAGE_TITLE = pageTitle("Account");

const AccountPage: NextPage = () => {
  const { user, isSuccess } = useUserQuery();

  const { data: userWithPosts } = useUserIdQuery(user?.id);

  const posts: Post[] = userWithPosts?.posts || [];

  if (!user) {
    if (isSuccess) {
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

    return <LoadingPage />;
  }

  const PageHeader = (
    <Flex
      direction={{ base: "column", md: "row" }}
      mt={{ md: "12" }}
      mb="6"
      gap={{ base: "8", md: "16" }}
      align="start"
    >
      <EditImageWidget user={user} display={{ base: "none", md: "initial" }} />
      <VStack align="start" width="100%">
        <Heading as="h1" size="lg" fontWeight="500" fontFamily="title">
          Your Account
        </Heading>
        <Text color="tertiaryText" fontWeight="semibold">
          {user.email}
        </Text>
        <Divider pt="2" />

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
        <AccountPostCardList posts={posts} isLinkActive={true} />
      </Layout>
    </>
  );
};

export default AccountPage;
