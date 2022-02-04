import algoliasearch from "algoliasearch";
import { SearchResponse } from "@algolia/client-search";
import { Book, Course } from "@prisma/client";

import {
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX_NAME,
} from "@lib/helpers/backend/env";

export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
export const indexName = ALGOLIA_INDEX_NAME;

const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);

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
