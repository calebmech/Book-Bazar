// Note that I was having trouble with https://www.npmjs.com/package/google-books-search
// The following code provides the same data and provides more information

import { makeAxiosRequest } from "./makeAxiosRequest";
import { GoogleBookSearchResult, GoogleBook } from "../../../common/types";

// Path to google books data and JSON type string
const googleBooksAPIPath =
  "https://www.googleapis.com/books/v1/volumes?q=isbn:";

export const getGoogleBooksData = async (
  isbn: string
): Promise<GoogleBook | null> => {
  const googleBooksAPIJSON: GoogleBookSearchResult = (await makeAxiosRequest(
    `${googleBooksAPIPath}${isbn}`
  )) as GoogleBookSearchResult;
  if (googleBooksAPIJSON?.totalItems === 0) return null;
  return (googleBooksAPIJSON as GoogleBookSearchResult)?.items[0]
    ?.volumeInfo as GoogleBook;
};
