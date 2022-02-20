import {
  Avatar,
  HStack,
  Image,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { User } from "@prisma/client";

interface UserWithAvatarProps {
  user: User | null;
  hideName?: boolean;
}
export default function UserWithAvatar({
  user,
  hideName = false,
}: UserWithAvatarProps) {
  const ProfilePicture = () => {
    if (user?.imageUrl) {
      return (
        <Image
          src={user?.imageUrl}
          borderRadius="full"
          alt=""
          width="32px"
          height="32px"
          priority
        />
      );
    }

    return <Avatar size="sm" />;
  };

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
