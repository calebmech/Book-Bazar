import { Flex, Spacer, Heading, Text } from "@chakra-ui/react";
import CreatePostWizard from "@components/create-post-page/CreatePostWizard";
import Layout from "@components/Layout";
import LoginModal from "@components/LoginModal";
import pageTitle from "@lib/helpers/frontend/page-title";
import { useUserQuery } from "@lib/hooks/user";
import type { NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";

const PAGE_TITLE = "Create Post";

export enum WizardPage {
  CHOOSE_ISBN,
  CONFIRM_BOOK,
  UPLOAD_PHOTO,
  SET_DETAILS,
  COMPLETE,
}
const NUMBER_PAGES = Object.entries(WizardPage).length / 2;

const CreatePosting: NextPage = () => {
  const { user } = useUserQuery();
  const [page, setPage] = useState<WizardPage>(WizardPage.CHOOSE_ISBN);

  if (!user) {
    return (
      <>
        <Head>
          <title>{PAGE_TITLE}</title>
        </Head>
        <Layout>
          <LoginModal
            isOpen={true}
            onClose={() => {
              router.back();
            }}
            message="To create a post you must be signed in. Please login with your MacID below."
          />
        </Layout>
      </>
    );
  }

  const pageTitles: Record<WizardPage, string> = {
    [WizardPage.CHOOSE_ISBN]: "Create Post",
    [WizardPage.CONFIRM_BOOK]: "Is This Your Book?",
    [WizardPage.UPLOAD_PHOTO]: "Upload Photo of Cover",
    [WizardPage.SET_DETAILS]: "Set Price and Description",
    [WizardPage.COMPLETE]: "Your post is now live!",
  };

  return (
    <>
      <Head>
        <title>{pageTitle(PAGE_TITLE)}</title>
      </Head>
      <Layout
        extendedHeader={
          <Flex
            maxWidth="md"
            width="100%"
            margin="auto"
            justify="space-between"
            alignItems="center"
            padding={{ base: "2", md: "0" }}
          >
            <Spacer flex="1" display={{ base: "none", md: "initial" }} />
            <Heading
              as="h2"
              size="md"
              fontWeight="semibold"
              flex="4"
              textAlign={{ base: "left", md: "center" }}
            >
              {pageTitles[page]}
            </Heading>
            <Text
              flex="1"
              fontSize="lg"
              fontWeight="semibold"
              textAlign="right"
              color="secondaryText"
            >
              {page + 1}/{NUMBER_PAGES}
            </Text>
          </Flex>
        }
      >
        <CreatePostWizard page={page} setPage={setPage} />
      </Layout>
    </>
  );
};

export default CreatePosting;
