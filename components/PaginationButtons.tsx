import { Flex, IconButton, Icon, Box, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

export interface PaginationButtonsProps {
  page: number;
  url: string;
  morePosts: boolean;
  isLoadingNextPage: boolean;
}

export function PaginationButtons({
  page,
  url,
  morePosts,
  isLoadingNextPage,
}: PaginationButtonsProps) {
  return (
    <Flex w="100%" justify="center" mt="8">
      <Link href={url + "?page=" + (page - 1)} passHref shallow>
        <IconButton
          aria-label="Previous page"
          disabled={page === 0}
          icon={<Icon as={ChevronLeftIcon} />}
        />
      </Link>
      <Box
        background="tertiaryBackground"
        borderRadius={4}
        p="2"
        pl="4"
        pr="4"
        ml="2"
        mr="2"
      >
        <Text>Page {page + 1}</Text>
      </Box>
      <Link href={url + "?page=" + (page + 1)} passHref shallow>
        <IconButton
          aria-label="Next page"
          disabled={!morePosts || isLoadingNextPage}
          icon={<Icon as={ChevronRightIcon} />}
          isLoading={isLoadingNextPage}
        />
      </Link>
    </Flex>
  );
}
