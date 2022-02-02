import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
} from "@chakra-ui/react";
import { CreditCardIcon, SearchIcon } from "@heroicons/react/solid";
import Link from "next/link";
import HeaderUserInfo from "./HeaderUserInfo";

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
            fontFamily="Lora"
            fontWeight="500"
            whiteSpace="nowrap"
          >
            <Link href="/">Book Bazar</Link>
          </Heading>
          {hideSearch ? (
            <Spacer gridArea="search" />
          ) : (
            // Placeholder search input
            <FormControl gridArea="search" zIndex={0}>
              <HStack>
                <InputGroup>
                  <Input
                    type="search"
                    variant="filled"
                    // Could make this cycle through a list of placeholders
                    placeholder="Algorithms 4th Edition"
                  />
                  <InputRightElement width="auto" pr="1">
                    <Button
                      colorScheme="teal"
                      size="sm"
                      px={5}
                      rightIcon={<Icon as={SearchIcon} />}
                    >
                      Search
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </HStack>
            </FormControl>
          )}
          <Box gridArea="account" textAlign="right">
            <HStack>
              <Link href="/post" passHref>
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
