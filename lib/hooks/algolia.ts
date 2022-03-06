import { queryAlgolia } from "@lib/services/algolia";
import { SearchResponse } from "@algolia/client-search";
import { useQuery, UseQueryResult } from "react-query";
import { CourseWithDept } from "@lib/services/course";
import { PopulatedBook } from "@lib/services/book";

export type SearchItem =
  | { type: "book"; entry: PopulatedBook }
  | { type: "course"; entry: CourseWithDept };

export function useAlgolia(
  query: string
): UseQueryResult<SearchResponse<SearchItem>> {
  return useQuery(["search", query], () => queryAlgolia(query));
}
