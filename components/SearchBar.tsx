/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx

  The file groups all search bar components with one another. The search bar
  consists of the SearchInput where users write their query, the SearchPanel
  which displays the autocomplete options, and the autocomplete hook which makes
  algolia queries.
*/

import { useState } from "react";
import {
  AutocompleteOptions,
  AutocompleteState,
} from "@algolia/autocomplete-core";
import { SearchInput } from "./SearchInput";
import { SearchPanel, SearchPanelProps } from "./SearchPanel";
import { useAutocomplete } from "@lib/hooks/autocomplete";
import { AutocompleteItem } from "@lib/hooks/autocomplete";
import { Box } from "@chakra-ui/react";
import React from "react";

const initialAutocompleteState: AutocompleteState<AutocompleteItem> = {
  collections: [],
  completion: null,
  context: {},
  isOpen: false,
  query: "",
  activeItemId: null,
  status: "idle",
};

// Returns the search bar displayed in the header and the home page
function SearchBarUnmemoized(
  props: Partial<AutocompleteOptions<AutocompleteItem>> & { overlay: boolean }
) {
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<AutocompleteItem>
  >(initialAutocompleteState);

  // Autocomplete hook used to retrieve data from Algolia while searching
  const autocomplete = useAutocomplete(props, setAutocompleteState);

  // Props for the search panel (containing)
  const searchPanelProps: SearchPanelProps = {
    autocomplete,
    autocompleteState,
    overlay: props.overlay,
  };

  return (
    <Box className="aa-Autocomplete" width="100%" position="relative">
      <SearchInput {...autocomplete}></SearchInput>
      <SearchPanel {...searchPanelProps}></SearchPanel>
    </Box>
  );
}

export const SearchBar = React.memo(SearchBarUnmemoized);
