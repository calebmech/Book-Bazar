/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx
*/

import { AutocompleteApi, AutocompleteState } from "@algolia/autocomplete-core";
import { AutocompleteItem } from "./SearchBar";
import SuggestionCard, { SuggestionProps } from "./SuggestionCard";
import router from "next/router";
import { Book } from "@prisma/client";
import { Box } from "@chakra-ui/react";

export interface SearchPanelProps {
  autocomplete: AutocompleteApi<
    AutocompleteItem,
    React.BaseSyntheticEvent<object, any, any>,
    React.MouseEvent<Element, MouseEvent>,
    React.KeyboardEvent<Element>
  >;
  autocompleteState: AutocompleteState<AutocompleteItem>;
  overlay: boolean;
}

export function getItemUrlPath(item: AutocompleteItem): string {
  if (item.type === "course") return `/course/${item.entry.id}`;
  return `/book/${(item.entry as Book).isbn}`;
}

export const SearchPanel = ({
  autocomplete,
  autocompleteState,
  overlay,
}: SearchPanelProps) => {
  if (autocompleteState.query != "" && autocompleteState.isOpen) {
    return (
      <Box
        bg="white"
        border="1px"
        borderColor="primaryBackground"
        rounded="md"
        boxShadow={"md"}
        position={overlay ? "absolute" : "relative"}
      >
        <div key={"search-panel-key"}>
          {autocompleteState.isOpen && (
            <div {...autocomplete.getPanelProps({})}>
              {autocompleteState.collections.map((collection, index) => {
                const { source, items } = collection;
                return (
                  <section key={`source-${index}`} className="aa-Source">
                    {items.length > 0 && (
                      <div {...autocomplete.getListProps()}>
                        {items.map((item) => {
                          const suggestionProps: SuggestionProps = {
                            type: item.type,
                            entry: item.entry,
                          };
                          return (
                            <div
                              key={item.objectID}
                              className="aa-Item"
                              {...autocomplete.getItemProps({
                                item,
                                source,
                              })}
                              onClick={function clicking() {
                                router.push(getItemUrlPath(item));
                              }}
                            >
                              <SuggestionCard
                                key={item.objectID}
                                {...suggestionProps}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </Box>
    );
  }
  return <></>;
};
