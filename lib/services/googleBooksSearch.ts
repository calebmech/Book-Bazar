import { google, books_v1 } from "googleapis";
import { GaxiosResponse } from "gaxios";

export type GoogleBook = books_v1.Schema$Volume['volumeInfo'];

export type GoogleBooksVolume = books_v1.Schema$Volumes;

export type GoogleBooksItems = books_v1.Schema$Volumes['items'];

const book = google.books({
  version: "v1",
});

export const getGoogleBooksData = async (
  isbn: string
): Promise<GoogleBook | null> => {
  const googleBooksAPIJSON: GaxiosResponse<GoogleBooksVolume> =
    await book.volumes.list({
      q: `isbn:${isbn}`,
    });

  const googleBook : GoogleBooksItems = googleBooksAPIJSON?.data?.items;

  if (!googleBook) return null;
  
  if (googleBook.length > 0) return googleBook[0]?.volumeInfo as GoogleBook;

  return null;
};
