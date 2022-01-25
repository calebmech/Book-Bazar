import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import Link from "next/link";
import HeaderUserInfo from "./HeaderUserInfo";
import { SearchBar } from "./SearchBar";

export interface HeaderProps {
  hideSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideSearch = false, children }) => {
  return (
    <Box as="header" backgroundColor="secondaryBackground" boxShadow="md">
      <Container py={{ base: 5, md: 8 }} maxWidth="container.lg">
        <Grid
          templateRows={{ base: "1fr 1fr", md: "1fr" }}
          templateColumns={{
            base: "auto auto",
            md: "1fr minmax(auto, 575px) 1fr",
          }}
          templateAreas={{
            base: `'logo account' 'search search'`,
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
          {hideSearch ? (
            <Spacer gridArea="search" />
          ) : (
            <SearchBar openOnFocus={true} overlay={true} />
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
                  Sell book
                </Button>
              </Link>
              <HeaderUserInfo />
            </HStack>
          </Box>
        </Grid>
        {children && <Box mt="8">{children}</Box>}
      </Container>
    </Box>
  );
};

export default Header;
