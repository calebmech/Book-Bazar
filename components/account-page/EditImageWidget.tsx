import {
  Avatar,
  Box,
  Button,
  Icon,
  StackProps,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";
import { PencilAltIcon } from "@heroicons/react/outline";
import { User, useUpdateUserMutation } from "@lib/hooks/user";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function EditImageWidget({
  user,
  ...props
}: { user: User } & StackProps) {
  const mutation = useUpdateUserMutation();

  const handleImageSubmit = (image: Blob) => {
    return mutation.mutateAsync({
      id: user.id,
      updateUserRequest: { image },
    });
  };

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imageModalKey, setImageModalKey] = useState("");
  const handleEditImage = () => {
    // Reset login modal each time it is opened
    setImageModalKey(uuid());
    onOpen();
  };

  return (
    <VStack {...props} textAlign="center">
      <ImageUploadModal
        key={imageModalKey}
        isOpen={isOpen}
        onClose={onClose}
        shape="round"
        aspectRatio={1}
        onUpload={handleImageSubmit}
      />
      <Box
        borderRadius="full"
        overflow="hidden"
        width={128}
        height={128}
        margin="auto"
        mb={1}
      >
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            width={128}
            height={128}
            alt="Profile picture"
          />
        ) : (
          <Avatar size="2xl" />
        )}
      </Box>
      <Button
        size="sm"
        variant="link"
        onClick={handleEditImage}
        leftIcon={<Icon as={PencilAltIcon} />}
      >
        Edit image
      </Button>
    </VStack>
  );
}
