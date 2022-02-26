import { Flex, Spinner } from "@chakra-ui/react";
import Layout from "./Layout";

export default function LoadingPage() {
  return (
    <Layout>
      <Flex width="100%" height="40vh" align="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    </Layout>
  );
}
