import {
  Avatar,
  Box,
  forwardRef,
  HStack,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import Image from "next/image";

interface UserWithAvatarProps {
  user: User | null;
  hideName?: boolean;
}
export default function UserWithAvatar({
  user,
  hideName = false,
}: UserWithAvatarProps) {
  const ProfilePicture = forwardRef((_, ref) => {
    if (user?.imageUrl) {
      return (
        <Box
          ref={ref}
          borderRadius="full"
          overflow="hidden"
          width="8"
          height="8"
        >
          <Image
            src={user?.imageUrl}
            alt=""
            width="32px"
            height="32px"
            priority
          />
        </Box>
      );
    }

    return <Avatar ref={ref} size="sm" />;
  });

  return (
    <HStack>
      {user ? (
        <ProfilePicture />
      ) : (
        <Tooltip label="Login to see user" placement="top">
          <ProfilePicture />
        </Tooltip>
      )}

      {!hideName && (
        <Skeleton isLoaded={Boolean(user)} speed={0}>
          <Text isTruncated color="secondaryText" fontWeight="semibold">
            {user?.name}
          </Text>
        </Skeleton>
      )}
    </HStack>
  );
}
