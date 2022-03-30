import { Box, Spinner, useToast } from "@chakra-ui/react";
import { useBookQuery } from "@lib/hooks/book";
import { useCreatePostMutation } from "@lib/hooks/createPost";
import { PostWithBookWithUser } from "@lib/services/post";
import { WizardPage } from "pages/create-post";
import { useCallback, useState } from "react";
import ChooseIsbn from "./ChooseIsbn";
import ConfirmBook from "./ConfirmBook";
import SetPriceAndDescription from "./SetPriceAndDescription";
import TextbookUploaded from "./TextbookUploaded";
import UploadTextbookCover from "./UploadTextbookCover";

export interface CreatePostWizardProps {
  page: number;
  setPage: (page: number) => void;
}

export default function CreatePostingWizard({
  page,
  setPage,
}: CreatePostWizardProps) {
  const [isbn, setIsbn] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<Blob | null>(null);

  const toast = useToast();

  const { data: book } = useBookQuery(isbn ?? undefined, {
    onSuccess: () => {
      setPage(WizardPage.CONFIRM_BOOK);
    },
    onError: () => {
      setPage(WizardPage.CHOOSE_ISBN);
      setIsbn(null);
      toast({
        title: "Book not found",
        description:
          "Unfortunately, that book doesn't appear to be required for any courses.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    },
    retry: 1,
  });

  const createPostMutation = useCreatePostMutation();

  const onIsbnTyped = useCallback(
    (isbn: string) => {
      setIsbn(isbn);
      setPage(WizardPage.CONFIRM_BOOK);
      setCoverPhoto(null);
    },
    [setIsbn, setPage, setCoverPhoto]
  );

  const onConfirmIsBook = () => {
    setPage(WizardPage.UPLOAD_PHOTO);
  };

  const onConfirmIsNotBook = () => {
    setCoverPhoto;
    setPage(WizardPage.CHOOSE_ISBN);
  };

  const onCoverPhotoUploaded = (inputCoverPhoto: Blob) => {
    setCoverPhoto(inputCoverPhoto);
    setPage(WizardPage.SET_DETAILS);
  };

  const onRetakePhoto = () => {
    setCoverPhoto(null);
    setPage(WizardPage.UPLOAD_PHOTO);
  };

  const onSubmitPressed = async (
    inputDescription: string,
    inputPrice: number
  ) => {
    if (book && coverPhoto) {
      createPostMutation.mutate(
        {
          bookId: book.id,
          description: inputDescription,
          image: coverPhoto,
          price: inputPrice,
        },
        {
          onSuccess: () => {
            setPage(page + 1);
          },
        }
      );
    } else {
      toast({
        title: "Something went wrong when creating your post. ",
        description:
          "Somehow, we lost track of which book you were trying to sell, or lost your cover photo. " +
          "Please try again later.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  switch (page) {
    case WizardPage.CHOOSE_ISBN:
      return <ChooseIsbn setIsbn={onIsbnTyped} />;
    case WizardPage.CONFIRM_BOOK:
      return book ? (
        <ConfirmBook
          book={book}
          onClickNo={onConfirmIsNotBook}
          onClickYes={onConfirmIsBook}
        />
      ) : (
        <Box textAlign="center" mt="16">
          <Spinner />
        </Box>
      );
    case WizardPage.UPLOAD_PHOTO:
      return (
        <UploadTextbookCover
          onCoverPhotoUploaded={onCoverPhotoUploaded}
          onClose={() => setCoverPhoto(null)}
        />
      );
    case WizardPage.SET_DETAILS:
      return book && coverPhoto ? (
        <SetPriceAndDescription
          book={book}
          coverPhoto={coverPhoto}
          onSubmitPressed={onSubmitPressed}
          isLoading={createPostMutation.isLoading}
          onRetakePhoto={onRetakePhoto}
        />
      ) : null;
    case WizardPage.COMPLETE:
      return (
        <TextbookUploaded
          post={createPostMutation.data as PostWithBookWithUser}
        />
      );
  }

  return null;
}
