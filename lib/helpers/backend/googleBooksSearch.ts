// Note that I was having trouble with https://www.npmjs.com/package/google-books-search
// The following code provides the same data and provides more information

import { makeFetchRequest } from './makeFetchRequest'
import { googleBookSearchResult, GoogleBook } from '../../../common/types'

// Path to google books data and JSON type string
const googleBooksAPIPath = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
const typeJSON = 'JSON'

export const getGoogleBooksData = async (
  isbn: string
): Promise<GoogleBook | Object> => {
  const googleBooksAPIJSON: googleBookSearchResult = (await makeFetchRequest(
    `${googleBooksAPIPath}${isbn}`,
    typeJSON
  )) as googleBookSearchResult
  if (googleBooksAPIJSON?.totalItems === 0) return {}
  return (googleBooksAPIJSON as googleBookSearchResult)?.items[0]
    ?.volumeInfo as GoogleBook
}
