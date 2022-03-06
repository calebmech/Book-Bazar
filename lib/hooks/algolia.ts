import { queryAlgolia } from "@lib/services/algolia";
import { SearchResponse } from "@algolia/client-search";
import { Book, Course } from "@prisma/client";
import { useQuery, UseQueryResult } from "react-query";
import { CourseWithDept } from "@lib/services/course";

export enum SearchItemType {
  BOOK = "book",
  COURSE = "course",
}

export type SearchItem =
  | { type: SearchItemType.BOOK; entry: Book }
  | { type: SearchItemType.COURSE; entry: CourseWithDept };

export function useAlgolia(
  query: string
): UseQueryResult<SearchResponse<SearchItem>> {
  return useQuery(["search", query], () => queryAlgolia(query));
}
