import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import Link from "next/link";
import HeaderUserInfo from "./HeaderUserInfo";

const Header: React.FC = ({ children }) => {
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
            base: "flex-start",
            md: "center",
          }}
          columnGap="12"
          rowGap="2"
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
          {/* Placeholder search input */}
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
                    rightIcon={<SearchIcon height={3} />}
                  >
                    Search
                  </Button>
                </InputRightElement>
              </InputGroup>
            </HStack>
          </FormControl>
          <Box gridArea="account" textAlign="right">
            <HeaderUserInfo />
          </Box>
        </Grid>
        {children && <Box mt="8">{children}</Box>}
      </Container>
    </Box>
  );
};

export default Header;
