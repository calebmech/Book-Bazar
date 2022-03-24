import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";
import HeaderUserInfo from "./HeaderUserInfo";
import { SearchBar } from "./SearchBar";

export interface HeaderProps {
  minimalContent?: boolean;
}


const Header: React.FC<HeaderProps> = ({
  minimalContent = false,
  children,
}) => {

  const SearchBarComponent = React.memo(SearchBar);

  return (
    <Box as="header" backgroundColor="secondaryBackground" boxShadow="md">
      <Container py={{ base: 5, md: 8 }} maxWidth="container.lg">
        <Grid
          templateRows={minimalContent ? "1fr" : { base: "1fr 1fr", md: "1fr" }}
          templateColumns={{
            base: "auto auto",
            md: "1fr minmax(auto, 575px) 1fr",
          }}
          templateAreas={{
            base: minimalContent
              ? `'logo account'`
              : `'logo account' 'search search'`,
            md: `'logo search account'`,
          }}
          justifyContent="space-between"
          alignItems={{
            base: "baseline",
            md: "center",
          }}
          columnGap={{ base: "4", lg: "12" }}
          rowGap="3"
        >
          {minimalContent ? (
            <Spacer gridArea="logo" />
          ) : (
            <Heading
              gridArea="logo"
              as="h1"
              size="lg"
              fontFamily="title"
              fontWeight="500"
              whiteSpace="nowrap"
            >
              <Link href="/">Book Bazar</Link>
            </Heading>
          )}
          {!minimalContent && (
            <Box gridArea="search">
              <SearchBarComponent openOnFocus={true} overlay={true} />
            </Box>
          )}
          <Box gridArea="account" textAlign="right">
            <HStack align="baseline">
              <Link href="/create-post" passHref>
                <Button
                  as="a"
                  colorScheme="teal"
                  variant="ghost"
                  rightIcon={<Icon as={CreditCardIcon} />}
                >
                  Sell
                  <Text
                    as="span"
                    sx={{
                      "@media (max-width: 320px)": {
                        display: "none",
                      },
                    }}
                  >
                    &nbsp;book
                  </Text>
                </Button>
              </Link>
              <HeaderUserInfo />
            </HStack>
          </Box>
        </Grid>
        {children && <Box mt={{ base: 8, md: 12 }}>{children}</Box>}
      </Container>
    </Box>
  );
};

export default Header;
