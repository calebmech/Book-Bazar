import { PopulatedBook } from "@lib/services/book";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

// With useRouter the routerquery would be undefined for first render, I'm using the enabled option 
// to wait for the router before sending a request

export function useBookQuery(bookIsbn: string | string[] | undefined): UseQueryResult<PopulatedBook> {
  return useQuery("book", () =>
    axios.get<PopulatedBook>(`/api/book/${bookIsbn}/`).then((res) => res.data),
    {
      enabled: !(bookIsbn == undefined || Array.isArray(bookIsbn)),
    }
  );
}