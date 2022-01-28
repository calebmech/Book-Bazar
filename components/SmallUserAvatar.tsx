import { HStack, Image, Text } from "@chakra-ui/react";
import { User } from "@prisma/client";

interface SmallUserAvatarProps {
  user: User | null;
}
export default function SmallUserAvatar({user}: SmallUserAvatarProps) {
  if (user) {
    return (
      <HStack>
        <Image 
          src={user.imageUrl || 'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'} 
          alt="profilepic"
          h="30px"
          w="30px"
          borderRadius='30px'
        />

        <Text color='gray.600' fontSize='sm' fontWeight={'bold'} isTruncated>
          {user.name}
        </Text>
      </HStack>
    )
  }
  else {
    return null;
  }
}