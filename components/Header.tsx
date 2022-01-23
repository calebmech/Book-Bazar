import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { useLogout, useUserQuery } from "@lib/hooks/user";
import { Colors, useColor } from "@styles/colors";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import Login from "./Login";

export default function Header() {
  const { isAuthenticated } = useUserQuery();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [loginModalKey, setLoginModalKey] = useState("");
  const handleLoginClick = () => {
    // Reset login modal each time it is opened
    setLoginModalKey(uuid());
    onOpen();
  };

  const logout = useLogout();

  return (
    <Box as="header" backgroundColor={useColor(Colors.secondaryBackground)}>
      <Container py={5} maxWidth="container.md">
        <Flex alignItems="baseline" justifyContent="space-between">
          <Heading as="h1" size="md">
            Book Bazar
          </Heading>
          <div />
          {!isAuthenticated ? (
            <Button variant="link" onClick={handleLoginClick}>
              Login
            </Button>
          ) : (
            <Button variant="link" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </Flex>
      </Container>

      <Login key={loginModalKey} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
