/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx
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

export function SearchBar(
  props: Partial<AutocompleteOptions<AutocompleteItem>> & { overlay: boolean }
) {
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<AutocompleteItem>
  >(initialAutocompleteState);

  const autocomplete = useAutocomplete(props, setAutocompleteState);

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
