import {
  Box,
  HStack,
  VStack,
  Wrap,
  Tag,
  TagLeftIcon,
  Text,
  Image,
} from "@chakra-ui/react";
import { AcademicCapIcon } from "@heroicons/react/outline";
import {
  resolveImageUrl,
  resolveBookTitle,
} from "@lib/helpers/frontend/resolve-book-data";
import { PopulatedBook } from "@lib/services/book";

interface BookPreviewProps {
  book: PopulatedBook;
  alternativeImage?: string;
}

export default function BookPreviewCard({
  book,
  alternativeImage,
}: BookPreviewProps) {
  return (
    <Box
      width="100%"
      height="36"
      shadow="md"
      borderRadius="lg"
      overflow="hidden"
      background="secondaryBackground"
    >
      <HStack spacing="4" height="100%">
        <Image
          src={alternativeImage ?? resolveImageUrl(book)}
          alt=""
          height="100%"
          mr="1"
        />
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
              <Tag key={course.id} size="sm" variant="solid" colorScheme="teal">
                <TagLeftIcon as={AcademicCapIcon} />
                {course.dept.abbreviation + " " + course.code}
              </Tag>
            ))}
          </Wrap>
        </VStack>
      </HStack>
    </Box>
  );
}
