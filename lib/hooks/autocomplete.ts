/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx

  The autocomplete hook takes user input, queries algolia, and controls
  the SearchPanel containing auto complete options.
*/

import React from "react";
import {
  AutocompleteApi,
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { Hit } from "@algolia/client-search";
import { searchClient, indexName } from "@lib/services/algolia";
import { Book } from "@prisma/client";
import { CourseWithDept } from "@lib/services/course";
import { getItemUrlPath } from "@components/SearchPanel";

const sourceId = "campus-store-data-source-id";
const hitsPerPage = 5;

export type AutocompleteItem = Hit<{
  type: string;
  entry: Book | CourseWithDept;
}>;

export interface SearchPanelProps {
  autocomplete: AutocompleteApi<
    AutocompleteItem,
    React.BaseSyntheticEvent<object, any, any>,
    React.MouseEvent<Element, MouseEvent>,
    React.KeyboardEvent<Element>
  >;
  autocompleteState: AutocompleteState<AutocompleteItem>;
  panelRef: React.RefObject<HTMLDivElement>;
}

export function useAutocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>,
  setAutocompleteState: React.Dispatch<
    React.SetStateAction<AutocompleteState<AutocompleteItem>>
  >
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
    [props, setAutocompleteState]
  );
}
