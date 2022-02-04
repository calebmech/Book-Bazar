import { Avatar, HStack, Image, Text } from "@chakra-ui/react";
import { User } from "@prisma/client";

interface UserWithAvatarProps {
  user: User | null;
  isYou?: boolean;
}
export default function UserWithAvatar({ user, isYou }: UserWithAvatarProps) {
  if (user) {
    return (
      <HStack>
        {user?.imageUrl ? (
          <Image
            src={user?.imageUrl}
            borderRadius="full"
            alt=""
            width="32px"
            height="32px"
            priority
          />
        ) : (
          <Avatar size="sm" />
        )}

        <Text color="secondaryText" fontWeight={"bold"} isTruncated>
          {isYou ? "You" : user.name}
        </Text>
      </HStack>
    );
  } else {
    return null;
  }
}
