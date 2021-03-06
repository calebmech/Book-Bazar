import {
  Button,
  FormControl,
  Stack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import { handleRawImage } from "@lib/helpers/frontend/handle-raw-image";
import { getFloatStringPriceAsNumber } from "@lib/helpers/priceHelpers";
import { useEditPostMutation } from "@lib/hooks/post";
import { PostWithBook, PostWithBookWithUser } from "@lib/services/post";
import ViewTextbookCover from "../create-post-page/ViewTextbookCover";
import EditPriceAndDescription from "../EditPriceAndDescription";
import { TEXTBOOK_ASPECT_RATIO } from "@components/create-post-page/UploadTextbookCover";
import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";

export interface EditPostProps {
  isOpen: boolean;
  onClose: VoidFunction;
  post: PostWithBook | PostWithBookWithUser;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostProps) {
  const {
    isOpen: isEditImageOpen,
    onOpen: onOpenEditImage,
    onClose: onEditImageClose,
  } = useDisclosure();

  const mutation = useEditPostMutation(post.id, post.userId);

  const [description, setDescription] = useState<string | null>(
    post.description
  );
  const [price, setPrice] = useState<number | null>(
    getFloatStringPriceAsNumber((post.price / 100).toFixed(2))
  );
  const [valid, setValid] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(post.imageUrl);
  const [image, setImage] = useState<Blob | null>(null);

  const onDescriptionChange = (description: string) => {
    setDescription(description);
  };

  const onPriceChange = (price: string) => {
    const newPrice = getFloatStringPriceAsNumber(price);
    setPrice(newPrice);
    newPrice ? setValid(true) : setValid(false);
  };

  const onImageBlobChange = (value: string) => {
    setImageUrl(value);
  };

  const onImageUploaded = (blob: Blob) => {
    setImage(blob);
    handleRawImage(blob, onImageBlobChange);
  };

  const handleSave = (event: FormEvent) => {
    mutation.mutate({
      ...(description && { description }),
      ...(price && { price }),
      ...(image && { image }),
    });

    event.preventDefault();
  };

  return !isEditImageOpen ? (
    <Modal
      isOpen={!mutation.isSuccess && isOpen}
      onClose={onClose ?? (() => {})}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader>Edit Post</ModalHeader>
        <ModalCloseButton />
        <FormControl>
          <form onSubmit={handleSave}>
            <ModalBody>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing="7"
                px="7"
                align="top"
              >
                <ViewTextbookCover
                  onOpen={onOpenEditImage}
                  imageUrl={imageUrl}
                />
                <EditPriceAndDescription
                  description={description}
                  price={price}
                  campusStorePrice={post.book.campusStorePrice}
                  onPriceChange={onPriceChange}
                  onDescriptionChange={onDescriptionChange}
                />
              </Stack>
            </ModalBody>
            <ModalFooter mr={2} mt={{ base: "6", md: "0" }}>
              <Button
                variant="outline"
                onClick={onClose}
                colorScheme="teal"
                mr={2}
              >
                Cancel
              </Button>
              {(mutation.isIdle || mutation.isLoading) && (
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={mutation.isLoading}
                  isDisabled={
                    (!valid ||
                      price ==
                        getFloatStringPriceAsNumber(
                          (post.price / 100).toFixed(2)
                        )) &&
                    description == post.description &&
                    imageUrl == post.imageUrl
                  }
                >
                  Save Changes
                </Button>
              )}
              {mutation.isError && (
                <Button
                  type="submit"
                  colorScheme="teal"
                  onClick={() => mutation.reset()}
                  rightIcon={<Icon as={RefreshIcon} />}
                >
                  Try again
                </Button>
              )}
            </ModalFooter>
          </form>
        </FormControl>
      </ModalContent>
    </Modal>
  ) : (
    <ImageUploadModal
      onUpload={async (blob) => onImageUploaded(blob)}
      isOpen={isEditImageOpen}
      aspectRatio={TEXTBOOK_ASPECT_RATIO}
      shape="rect"
      onClose={onEditImageClose}
    />
  );
}
