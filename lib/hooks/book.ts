import { PopulatedBook } from "@lib/services/book";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

export function useBookQuery(bookIsbn: string | string[] | undefined): UseQueryResult<PopulatedBook> {
  return useQuery("book-" + bookIsbn, () =>
    axios.get<PopulatedBook>(`/api/book/${bookIsbn}/`).then((res) => res.data),
    {
      enabled: !(bookIsbn == undefined || Array.isArray(bookIsbn)),
    }
  );
}