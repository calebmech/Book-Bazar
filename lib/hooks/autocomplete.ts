/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx

  The autocomplete hook takes user input, queries algolia, and controls
  the SearchPanel containing auto complete options.
*/

import React from "react";
import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { searchClient, indexName } from "@lib/services/algolia";
import { Hit } from "@algolia/client-search";
import { SearchItem, SearchItemType } from "./algolia";

const sourceId = "campus-store-data-source-id";
const hitsPerPage = 5;

export type AutocompleteItem = Hit<SearchItem>;

export function getItemUrlPath(item: AutocompleteItem): string {
  if (item.type === SearchItemType.COURSE)
    return `/course/${item.entry.dept.abbreviation}-${item.entry.code}`;
  return `/book/${item.entry.isbn}`;
}

export function useAutocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>,
  setAutocompleteState: React.Dispatch<
    React.SetStateAction<AutocompleteState<AutocompleteItem>>
  >,
  type?: SearchItemType
) {
  return React.useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        onStateChange({ state }) {
          setAutocompleteState(state);
        },
        getSources() {
          return [
            {
              sourceId,
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName,
                      query,
                      params: {
                        hitsPerPage,
                        facetFilters: type ? [`type:${type}`] : undefined,
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return getItemUrlPath(item);
              },
            },
          ];
        },
        ...props,
      }),
    [props, setAutocompleteState, type]
  );
}
