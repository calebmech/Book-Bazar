import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import Layout from "@components/Layout";
import pageTitle from "@lib/helpers/frontend/page-title";
import type { NextPage } from "next";
import Head from "next/head";
import Logo from "@components/Logo";
import { SearchBar } from "@components/SearchBar";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
        <meta
          name="description"
          content="Your one-stop-shop for buying and selling textbooks at Mac!"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Layout minimalHeader>
        <VStack mt={{ base: "20", md: "36" }} spacing="14">
          <VStack spacing="4" width="100%">
            <HStack
              spacing={{ base: 3, md: 5 }}
              fontSize={{ base: "4xl", md: "6xl" }}
            >
              <Logo />
              <Text
                color="accent"
                fontFamily="title"
                fontWeight="500"
                whiteSpace="nowrap"
              >
                Book Bazar
              </Text>
            </HStack>
            <Box margin="auto" maxWidth="40rem" width="100%">
              <SearchBar openOnFocus={true} autoFocus overlay={true} />
            </Box>
          </VStack>
          <Divider width="80%" maxWidth="sm" />

          <Link href="/create-post" passHref>
            <Button as="a" colorScheme="teal">
              Sell your used textbooks!
            </Button>
          </Link>
        </VStack>
      </Layout>
    </>
  );
};

export default Home;
