import { queryAlgolia } from "@lib/services/algolia";
import { SearchResponse } from "@algolia/client-search";
import { Book, Course } from "@prisma/client";
import { useQuery, UseQueryResult } from "react-query";
import { CourseWithDept } from "@lib/services/course";

export type SearchItem =
  | { type: "book"; entry: Book }
  | { type: "course"; entry: CourseWithDept };

export function useAlgolia(
  query: string
): UseQueryResult<SearchResponse<SearchItem>> {
  return useQuery(["search", query], () => queryAlgolia(query));
}
