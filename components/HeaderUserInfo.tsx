import {
  Avatar,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useLogout, useUserQuery } from "@lib/hooks/user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import LoginModal from "./LoginModal";

export default function HeaderUserInfo() {
  const { user } = useUserQuery();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [loginModalKey, setLoginModalKey] = useState("");
  const handleLoginClick = () => {
    // Reset login modal each time it is opened
    setLoginModalKey(uuid());
    onOpen();
  };

  const logout = useLogout();

  if (!user) {
    return (
      <>
        <Button
          variant="link"
          onClick={handleLoginClick}
          alignSelf={{ base: "center", sm: "initial" }}
        >
          <HStack spacing="0">
            <Text fontWeight="semibold" color="tertiaryText" mr="3">
              Login
            </Text>
            <Avatar size="sm" />
          </HStack>
        </Button>
        <LoginModal
          key={loginModalKey}
          isOpen={isOpen}
          onClose={onClose}
          message="To sell your textbooks or contact sellers please login with your MacID below."
        />
      </>
    );
  }

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton
          aria-label="Account menu"
          alignSelf={{ base: "center", sm: "initial" }}
        >
          <HStack spacing="0">
            <Text
              display={{ base: "none", sm: "initial" }}
              fontWeight="semibold"
              color="tertiaryText"
              whiteSpace="nowrap"
              mr="3"
            >
              {user.name?.split(" ")[0] ?? user.email.split("@")[0]}
            </Text>
            {user?.imageUrl ? (
              <Box borderRadius="full" overflow="hidden" width="8" height="8">
                <Image
                  src={user?.imageUrl}
                  alt=""
                  width="32px"
                  height="32px"
                  priority
                />
              </Box>
            ) : (
              <Avatar size="sm" />
            )}
          </HStack>
        </MenuButton>
        <MenuList>
          <Link href="/account" passHref>
            <MenuItem as="a">Account</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
