import {
  Flex,
  Heading,
  Icon,
  IconButton,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import Quagga from "@ericblade/quagga2";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useCreatePostMutation } from "@lib/hooks/createPost";
import { PopulatedBook } from "@lib/services/book";
import { PostWithBookWithUser } from "@lib/services/post";
import axios from "axios";
import { useState } from "react";
import ChooseScanOrType from "./ChooseScanOrType";
import ConfirmBook from "./ConfirmBook";
import ScanBarcode from "./ScanBarcode";
import SetPriceAndDescription from "./SetPriceAndDescription";
import TextbookUploaded from "./TextbookUploaded";
import UploadTextbookCover from "./UploadTextbookCover";

export default function CreatePostingWizard() {
  const NUMBER_PAGES = 6;
  const [pageNumber, setPageNumber] = useState<number>(0);

  // data needed for the POST
  const [book, setBook] = useState<PopulatedBook | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<Blob | null>(null);

  const toast = useToast();

  const createPostMutation = useCreatePostMutation();

  const onIsbnTyped = (book: PopulatedBook) => {
    setBook(book);
    setPageNumber(2);
  };

  const onScanSelected = () => {
    setPageNumber(1);
  };

  const onBackButton = () => {
    if (pageNumber == 2) {
      setPageNumber(0);
    } else {
      Quagga.stop();
      setPageNumber(pageNumber - 1);
    }
  };

  const onScanIsbn = async (isbn: string) => {
    try {
      const book: PopulatedBook = (
        await axios.get<PopulatedBook>(`/api/book/${isbn}`)
      ).data;
      if (book) {
        setBook(book);
        setPageNumber(pageNumber + 1);
      }
    } catch (e) {
      // Do nothing. More than likely, the book wasn't detected correctly
    }
  };

  const onNoCamera = () => {
    setPageNumber(0);
    toast({
      title: "No camera detected",
      description:
        "If you don't have a camera, you can type in the ISBN by hand. " +
        "If you do, please make sure you allow Book Bazar to access it.",
      status: "error",
      duration: 10000,
      isClosable: true,
    });
  };

  const onConfirmIsBook = () => {
    setPageNumber(pageNumber + 1);
  };

  const onConfirmIsNotBook = () => {
    setPageNumber(0);
  };

  const onCoverPhotoUploaded = (inputCoverPhoto: Blob) => {
    setCoverPhoto(inputCoverPhoto);
    setPageNumber(pageNumber + 1);
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
            setPageNumber(pageNumber + 1);
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

  return (
    <>
      <Flex
        backgroundColor="primaryBackground"
        padding={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          aria-label="Back button"
          icon={<Icon as={ArrowLeftIcon} />}
          isDisabled={pageNumber === 0 || pageNumber === 5}
          mr={6}
          colorScheme="teal"
          onClick={onBackButton}
        />
        <Spacer />
        <Heading as="h2" size="md">
          {
            {
              "0": "Create Post",
              "1": "Scan Barcode",
              "2": "Is This Your Book?",
              "3": "Upload Photo of Cover",
              "4": "Set Price and Description",
              "5": "Post Created",
            }[pageNumber]
          }
        </Heading>
        <Spacer />
        <Heading as="h2" size="md" ml={6} mr={1}>
          {pageNumber + 1}/{NUMBER_PAGES}
        </Heading>
      </Flex>

      {
        {
          "0": (
            <ChooseScanOrType
              onScanSelected={onScanSelected}
              onIsbnTyped={onIsbnTyped}
            />
          ),
          "1": <ScanBarcode onDetected={onScanIsbn} onNoCamera={onNoCamera} />,
          "2": book && (
            <ConfirmBook
              book={book}
              onClickNo={onConfirmIsNotBook}
              onClickYes={onConfirmIsBook}
            />
          ),
          "3": (
            <UploadTextbookCover onCoverPhotoUploaded={onCoverPhotoUploaded} />
          ),
          "4": book && (
            <SetPriceAndDescription
              book={book}
              onSubmitPressed={onSubmitPressed}
              isLoading={createPostMutation.isLoading}
            />
          ),
          "5": <TextbookUploaded post={createPostMutation.data as PostWithBookWithUser} />,
        }[pageNumber]
      }
    </>
  );
}
