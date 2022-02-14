import CreatePostWizard from "@components/create-post-page/CreatePostWizard";
import Layout from "@components/Layout";
import LoginModal from "@components/LoginModal";
import pageTitle from "@lib/helpers/frontend/page-title";
import { useUserQuery } from "@lib/hooks/user";
import type { NextPage } from "next";
import Head from "next/head";
import router from "next/router";

const PAGE_TITLE = "Create Post";

const CreatePosting: NextPage = () => {
  const { user } = useUserQuery();

  if (!user) {
    return (
      <>
        <Head>
          <title>{PAGE_TITLE}</title>
        </Head>
        <Layout>
          <LoginModal
            isOpen={true}
            onClose={() => {router.back()}}
            message="To create a post you must be signed in. Please login with your MacID below."
          />
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle(PAGE_TITLE)}</title>
      </Head>
      <Layout>
        <CreatePostWizard />
      </Layout>
    </>
  );
};

export default CreatePosting;
