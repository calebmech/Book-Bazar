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
import { Hit } from "@algolia/client-search";
import { Book } from "@prisma/client";
import { CourseWithDept } from "@lib/services/course";
import { SearchInput } from "./SearchInput";
import { SearchPanel, SearchPanelProps } from "./SearchPanel";
import { useAutocomplete } from "@lib/hooks/autocomplete";

export type AutocompleteItem = Hit<{
  type: string;
  entry: Book | CourseWithDept;
}>;

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
export function SearchBar(
  props: Partial<AutocompleteOptions<AutocompleteItem>> & { overlay: boolean }
) {
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<AutocompleteItem>
  >(initialAutocompleteState);

  // Autocomplete hook used to retreive data from Algolia while searching
  const autocomplete = useAutocomplete(props, setAutocompleteState);

  // Props for the search panel (containing)
  const searchPanelProps: SearchPanelProps = {
    autocomplete,
    autocompleteState,
    overlay: props.overlay,
  };

  return (
    <div className="aa-Autocomplete">
      <SearchInput {...autocomplete}></SearchInput>
      <SearchPanel {...searchPanelProps}></SearchPanel>
    </div>
  );
}
