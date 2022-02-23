import { PopulatedBook } from "@lib/services/book";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

export function useBookQuery(
  bookIsbn: string | string[] | undefined,
  page: number | null = 0,
  length: number | null = 4
): UseQueryResult<PopulatedBook> {
  return useQuery(
    "book-" + bookIsbn + "-" + page,
    () =>
      axios
        .get<PopulatedBook>(
          `/api/book/${bookIsbn}?page=${page}&length=${length}`
        )
        .then((res) => res.data),
    {
      enabled: !!bookIsbn && !Array.isArray(bookIsbn),
      keepPreviousData: true,
    }
  );
}
