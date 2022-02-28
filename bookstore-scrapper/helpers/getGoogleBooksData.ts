import { google, books_v1 } from "googleapis";
import { GaxiosResponse } from "gaxios";

export type GoogleBook = books_v1.Schema$Volume["volumeInfo"];

type GoogleBooksVolume = books_v1.Schema$Volumes;

type GoogleBooksItems = books_v1.Schema$Volumes["items"];

const book = google.books({
  version: "v1",
});

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getGoogleBooksData = async (
  isbn: string
): Promise<GoogleBook | null> => {
  /* Waiting on Google to provide us with a higher request/minute quota (currently capped at 100).
     For now, it is doing a timeout for each request. */
  await timeout(500);

  const googleBooksAPIJSON: GaxiosResponse<GoogleBooksVolume> =
    await book.volumes.list({
      q: `isbn:${isbn}`,
    });

  const googleBook: GoogleBooksItems = googleBooksAPIJSON?.data?.items;

  if (!googleBook) return null;

  if (googleBook.length > 0) return googleBook[0]?.volumeInfo as GoogleBook;

  return null;
};
