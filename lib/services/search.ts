import leven from "leven";

const FILTER_RATIO = 0.5;

/**
 * Represents the search parameters
 */
export type SearchParams = {
  searchText: string;
  pageLength: number;
  page: number;
};

/**
 * Returns true if under half of the letters of the shorter string have be changed
 * in order to make a substring of the longer string, and false otherwise.
 *
 * @param stringA the first string to compare
 * @param stringB the second string to compare
 * @returns true if under half of the letters of the shorter string have to be
 *          changed in order to make a substring of the longer string,
 *          and false otherwise
 */
export function isAlmostSubstring(stringA: string, stringB: string): boolean {
  if (stringA.length > stringB.length) {
    return isAlmostSubstring(stringB, stringA);
  }
  const distance = leven(
    stringB.toLocaleLowerCase(),
    stringA.toLocaleLowerCase()
  );
  const criteriaNumber =
    stringB.length - distance - stringA.length * FILTER_RATIO;
  return criteriaNumber >= 0;
}

/**
 * Extracts the search parameters from the given endpoint query.
 *
 * @param query the map representing the endpoint query string
 * @returns the search parameters structure
 * @throws if the search query is missing or if the page or pageLength are not numbers
 */
export function getSearchParamsFromQuery(query: {
  [key: string]: string | string[];
}): SearchParams {
  let searchText = "";
  if (query.q && typeof query.q === "string") {
    searchText = query.q;
  } else {
    throw new Error("Missing search query");
  }

  let pageLength = 50;
  if (query.pageLength && typeof query.pageLength === "number") {
    pageLength = query.pageLength;
  }

  let page = 0;
  if (query.page && typeof query.page === "number" && query.page >= 0) {
    page = query.page;
  }

  return {
    searchText: searchText,
    pageLength: pageLength,
    page: page,
  };
}
