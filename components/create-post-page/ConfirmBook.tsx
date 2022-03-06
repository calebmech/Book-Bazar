import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Spacer,
  Tag,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { AcademicCapIcon, ArrowLeftIcon } from "@heroicons/react/solid";
import {
  resolveBookTitle,
  resolveImageUrl,
} from "@lib/helpers/frontend/resolve-book-data";
import { PopulatedBook } from "@lib/services/book";

interface Props {
  book: PopulatedBook;
  onClickYes: () => void;
  onClickNo: () => void;
}

export default function ConfirmBook({ book, onClickYes, onClickNo }: Props) {
  return (
    <VStack maxWidth="sm" margin="auto" spacing="4">
      <Box
        width="100%"
        height="36"
        shadow="md"
        borderRadius="lg"
        overflow="hidden"
        background="secondaryBackground"
        mb="4"
      >
        <HStack spacing="4" height="100%">
          <Image src={resolveImageUrl(book)} alt="" height="100%" mr="1" />
          <VStack
            align="start"
            height="100%"
            py="4"
            pr="4"
            justifyContent="space-between"
          >
            <Box mb="2">
              <Text fontWeight="semibold">{resolveBookTitle(book)}</Text>
              <Text color="secondaryText" fontSize="sm">
                {book.googleBook?.authors?.join(", ")}
              </Text>
            </Box>
            <Wrap>
              {book.courses.map((course) => (
                <Tag
                  key={course.id}
                  size="sm"
                  variant="solid"
                  colorScheme="teal"
                >
                  <TagLeftIcon as={AcademicCapIcon} />
                  {course.dept.abbreviation + " " + course.code}
                </Tag>
              ))}
            </Wrap>
          </VStack>
        </HStack>
      </Box>
      <HStack spacing={5} justifyContent="flex-end" width="100%">
        <Button
          onClick={onClickNo}
          variant="link"
          leftIcon={<Icon as={ArrowLeftIcon} />}
        >
          Try again
        </Button>
        <Button colorScheme="teal" onClick={onClickYes}>
          That&rsquo;s it!
        </Button>
      </HStack>
    </VStack>
  );
}
