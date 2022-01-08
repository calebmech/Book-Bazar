// Note that I was having trouble with https://www.npmjs.com/package/google-books-search
// The following code provides the same data and provides more information

import { makeFetchRequest } from './makeFetchRequest';
import { googleBookSearchResult, googleBook } from '../../../common/types';

// Path to google books data and JSON type string
const googleBooksAPIPath = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
const typeJSON = 'JSON';

export const getGoogleBooksData = async (isbn : string) : Promise<googleBook | null> => {
    const googleBooksAPIJSON : googleBookSearchResult = (await makeFetchRequest(`${googleBooksAPIPath}${isbn}`, typeJSON)) as googleBookSearchResult;
    if (googleBooksAPIJSON?.totalItems == 0) return null;
    return ((googleBooksAPIJSON as googleBookSearchResult)?.items[0]?.volumeInfo) as googleBook;
}