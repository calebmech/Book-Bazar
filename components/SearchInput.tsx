/* This file is configured based on the following Algolia demo:
  https://codesandbox.io/s/exciting-gwen-jr5kj?file=/src/Autocomplete.tsx

  The file returns the search input used to retrieve user queries.
*/

import { AutocompleteApi } from "@algolia/autocomplete-core";
import {
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { AutocompleteItem } from "@lib/hooks/autocomplete";
import { Router, useRouter } from "next/router";
import { FormEvent, useRef } from "react";

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
  const router = useRouter();

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const query = formData.get("q");

    if (typeof query === "string") {
      router.push("/search?q=" + encodeURIComponent(query));
    }

    event.preventDefault();
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <FormControl>
        <InputGroup size="lg">
          <Input
            {...autocomplete.getInputProps({
              id: "search-input",
              "aria-labelledby": "",
              inputElement: inputRef.current,
            })}
            type="search"
            name="q"
            aria-label="Find a book or course"
            placeholder="Find a book or course"
            required
            autoComplete="off"
            shadow="sm"
            textColor="primaryText"
            bg="secondaryBackground"
          />
          <InputRightElement pr="0.5rem" width="auto">
            <IconButton
              type="submit"
              aria-label="Search"
              icon={<Icon as={SearchIcon} />}
              colorScheme="teal"
              h="2.3rem"
              sx={{
                "@media (min-width: 376px)": {
                  display: "none",
                },
              }}
            />
            <Button
              type="submit"
              rightIcon={<Icon as={SearchIcon} />}
              colorScheme="teal"
              h="2.3rem"
              sx={{
                "@media (max-width: 375px)": {
                  display: "none",
                },
              }}
            >
              Search
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </form>
  );
};
