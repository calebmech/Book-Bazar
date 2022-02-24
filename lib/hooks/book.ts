import { PopulatedBook } from "@lib/services/book";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

export function useBookQuery(
  bookIsbn: string | string[] | undefined,
  page: number | null = null,
  length: number | null = null
): UseQueryResult<PopulatedBook> {
  const url = "/api/book/" + bookIsbn;
  const parameters = new URLSearchParams();
  if (page) parameters.set("page", page.toString());
  if (length) parameters.set("length", length.toString());
  return useQuery(
    "book-" + bookIsbn + "-" + page,
    () =>
      axios
        .get<PopulatedBook>(url + parameters.toString())
        .then((res) => res.data),
    {
      enabled: !!bookIsbn && !Array.isArray(bookIsbn),
      keepPreviousData: true,
    }
  );
}
