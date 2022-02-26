import { PopulatedBook, PostWithUser } from "@lib/services/book";
import { Post } from "@prisma/client";
import axios from "axios";
import { UseQueryResult, useQuery, useQueries } from "react-query";

export function useBookQuery(
  isbn: string | string[] | undefined,
  initialData?: PopulatedBook
): UseQueryResult<PopulatedBook> {
  return useQuery(
    ["book", isbn],
    () =>
      axios.get<PopulatedBook>(`/api/book/${isbn}/`).then((res) => res.data),
    {
      enabled: !!isbn && !Array.isArray(isbn),
      initialData,
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );
}

export function useBookQueries(
  isbns: string[],
  initialData?: PopulatedBook[]
): UseQueryResult<PopulatedBook>[] {
  return useQueries(
    isbns.map((isbn) => ({
      queryKey: ["book", isbn],
      queryFn: () =>
        axios.get<PopulatedBook>(`/api/book/${isbn}/`).then((res) => res.data),
      initialData: initialData?.find((book) => book.isbn === isbn),
      staleTime: 1000 * 60 * 60, // 1 hour
    }))
  );
}

export function useBookPostsQuery(
  isbn: string | string[] | undefined,
  page: number | null = null,
  length: number | null = null
): UseQueryResult<(Post | PostWithUser)[]> {
  const parameters = new URLSearchParams();
  if (page) parameters.set("page", page.toString());
  if (length) parameters.set("length", length.toString());
  return useQuery(
    ["book", isbn, "posts", page],
    () =>
      axios
        .get<(Post | PostWithUser)[]>(
          `/api/book/${isbn}/posts${
            page || length ? "?" + parameters.toString() : ""
          }`
        )
        .then((res) => res.data),
    {
      enabled: !!isbn && !Array.isArray(isbn),
      keepPreviousData: true,
    }
  );
}
