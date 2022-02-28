import algoliasearch from "algoliasearch";
import { SearchResponse } from "@algolia/client-search";
import { Course } from "@prisma/client";

import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_API_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from "@lib/helpers/env";
import { PopulatedBook } from "./book";

export const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_API_KEY
);
export const indexName = NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

const index = searchClient.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

export async function queryAlgolia(query: string): Promise<
  SearchResponse<{
    type: string;
    entry: PopulatedBook | Course;
  }>
> {
  return await index.search<{ type: string; entry: PopulatedBook | Course }>(
    query,
    {
      attributesToRetrieve: ["type", "entry"],
    }
  );
}
