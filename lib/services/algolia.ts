import algoliasearch from "algoliasearch";
import { SearchResponse } from "@algolia/client-search";
import { Book, Course } from "@prisma/client";

import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_API_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from "@lib/helpers/env";

export const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_API_KEY
);
export const indexName = NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

const index = searchClient.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

export async function queryAlgolia(query: string): Promise<
  SearchResponse<{
    type: string;
    entry: Book | Course;
  }>
> {
  return await index.search<{ type: string; entry: Book | Course }>(query, {
    attributesToRetrieve: ["type", "entry"],
  });
}
