import { queryAlgolia } from "@lib/services/algolia";
import { SearchResponse } from "@algolia/client-search";
import { Book, Course } from "@prisma/client";
import { useQuery, UseQueryResult } from "react-query";

export function useAlgolia(search: string): UseQueryResult<
  SearchResponse<{
    type: string;
    entry: Book | Course;
  }>
> {
  return useQuery(search, () => queryAlgolia(search));
}
