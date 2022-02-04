/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx

  The file returns the search input used to retrieve user queries.
*/

import { useRef } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { AutocompleteApi } from "@algolia/autocomplete-core";
import { AutocompleteItem } from "@lib/hooks/autocomplete";

/* The search input component takes the autocomplete hook as input to update
   the state of the search.
*/
export const SearchInput = (
  autocomplete: AutocompleteApi<
    AutocompleteItem,
    React.BaseSyntheticEvent<object, any, any>,
    React.MouseEvent<Element, MouseEvent>,
    React.KeyboardEvent<Element>
  >
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form action="/search">
      <Flex>
        <InputGroup size="lg">
          <Input
            {...autocomplete.getInputProps({
              inputElement: inputRef.current,
            })}
            type="text"
            name="q"
            placeholder="Search for book or course"
            required
            width="40rem"
            autoComplete="off"
            shadow="sm"
            bg="white"
          />
          <InputRightElement className="InputRight" pr="0.5rem" width="7.5">
            <Button
              rightIcon={<Icon as={SearchIcon} />}
              colorScheme="teal"
              h="2.3rem"
              type="submit"
            >
              Search
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </form>
  );
};