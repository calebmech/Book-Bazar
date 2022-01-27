import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { useLogout, useUserQuery } from "@lib/hooks/user";
import { Colors, useColor } from "@styles/colors";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import LoginModal from "./LoginModal";

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
          <Spacer />
          {!isAuthenticated ? (
            <Button variant="outline" onClick={handleLoginClick}>
              Login
            </Button>
          ) : (
            <Button variant="outline" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </Flex>
      </Container>

      <LoginModal
        key={loginModalKey}
        isOpen={isOpen}
        onClose={onClose}
        message="To sell your textbooks or contact sellers please login with your MacID below."
      />
    </Box>
  );
}
