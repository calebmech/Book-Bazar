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
import { SearchItem, SearchItemType } from "@lib/hooks/algolia";

const initialAutocompleteState: AutocompleteState<AutocompleteItem> = {
  collections: [],
  completion: null,
  context: {},
  isOpen: false,
  query: "",
  activeItemId: null,
  status: "idle",
};

export type SearchBarProps = {
  overlay: boolean;
  type?: SearchItemType;
  onSelectItem?: (item: SearchItem) => void;
} & Partial<AutocompleteOptions<AutocompleteItem>>;

// Returns the search bar displayed in the header and the home page
export const SearchBar: React.FC<SearchBarProps> = ({
  overlay,
  type,
  onSelectItem,
  ...props
}) => {
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<AutocompleteItem>
  >(initialAutocompleteState);

  // Autocomplete hook used to retrieve data from Algolia while searching
  const autocomplete = useAutocomplete(props, setAutocompleteState, type);

  return (
    <Box className="aa-Autocomplete" width="100%" position="relative">
      <SearchInput {...autocomplete} />
      <SearchPanel
        autocomplete={autocomplete}
        autocompleteState={autocompleteState}
        overlay={overlay}
        onSelectItem={onSelectItem}
      />
    </Box>
  );
};
