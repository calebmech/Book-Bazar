import {
  Button,
  FormControl,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RefreshIcon } from "@heroicons/react/outline";
import { ChangeEvent, FormEvent, useState } from "react";
import { useEditPostMutation } from "@lib/hooks/post";
import { getFloatStringPriceAsNumber } from "@lib/helpers/priceHelpers";
import { PostWithBookWithUser } from "@lib/services/post";
import UploadTextbookCover from "./create-post-page/UploadTextbookCover";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import ViewTextbookCover from "./create-post-page/ViewTextbookCover";
import EditPriceAndDescription from "./EditPriceAndDescription";
import { handleRawImage } from "@lib/helpers/frontend/handle-raw-image";

export interface EditPostProps {
  isOpen: boolean;
  onClose: VoidFunction;
  post: PostWithBookWithUser;
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

  const router = useRouter();
  const mutation = useEditPostMutation(post.id);

  const [description, setDescription] = useState<string | null>(
    post.description
  );
  const [price, setPrice] = useState<number | null>(
    getFloatStringPriceAsNumber((post.price / 100).toFixed(2))
  );
  const [valid, setValid] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(post.imageUrl);
  const [image, setImage] = useState<Blob | null>(null);
  const [imageUploadModalKey, setImageUploadModalKey] = useState("");

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = getFloatStringPriceAsNumber(e.target.value.trim());
    setPrice(newPrice);
    newPrice ? setValid(true) : setValid(false);
  };

  const handleEditImageClick = () => {
    // Reset edit post modal each time it is opened
    setImageUploadModalKey(uuid());
    onOpenEditImage();
  };

  const onImageUploaded = (inputimage: Blob) => {
    setImage(inputimage);
    handleRawImage(inputimage, setImageUrl);
    onEditImageClose();
  };

  const handleSave = (event: FormEvent) => {
    mutation.mutate({
      ...(description && { description }),
      ...(price && { price }),
      ...(image && { image }),
    });

    event.preventDefault();
  };

  const handleClose = () => {
    mutation.isSuccess ? router.reload() : onClose();
  };

  if (mutation.isSuccess) {
    if (description) post.description = description;
    if (price && valid) {
      const newPrice = getFloatStringPriceAsNumber((price * 100).toFixed(2));
      if (newPrice) {
        post.price = newPrice;
      }
    }
    if (imageUrl) post.imageUrl = imageUrl;
    setValid(false);

    mutation.reset();
  }

  return !isEditImageOpen ? (
    <Modal isOpen={isOpen} onClose={onClose ?? (() => {})} size="xl">
      <ModalOverlay />
      <ModalContent pt={5} pb={4}>
        <FormControl>
          <form onSubmit={handleSave}>
            <ModalBody>
              <VStack spacing={7}>
                <ViewTextbookCover
                  onOpen={handleEditImageClick}
                  imageUrl={imageUrl}
                />
                <EditPriceAndDescription
                  description={description}
                  handlePriceChange={handlePriceChange}
                  handleDescriptionChange={handleDescriptionChange}
                  post={post}
                ></EditPriceAndDescription>
              </VStack>
            </ModalBody>
            <ModalFooter mr={2}>
              <Button
                type="submit"
                mr={2}
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
              <Button
                type="submit"
                variant="outline"
                onClick={handleClose}
                colorScheme="teal"
              >
                Close
              </Button>
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
    <UploadTextbookCover
      key={imageUploadModalKey}
      onCoverPhotoUploaded={onImageUploaded}
      isOpen={isEditImageOpen}
      onClose={onEditImageClose}
    />
  );
}
