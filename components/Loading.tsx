import { Stack, Spinner, Heading } from "@chakra-ui/react";
import Layout from "./Layout";

export default function Loading() {
  return (
    <Layout marginY="200">
      <Stack align="center">
        <Heading color={"primaryText"}>Loading</Heading>
        <Spinner color="accent" size="lg"></Spinner>
      </Stack>
    </Layout>
  );
}
