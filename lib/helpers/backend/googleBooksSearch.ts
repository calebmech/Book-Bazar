import { GoogleBook } from "../../../common/types";
import { google, books_v1 } from "googleapis";
import { GaxiosResponse } from "gaxios";

const book = google.books({
  version: "v1",
});

export const getGoogleBooksData = async (
  isbn: string
): Promise<GoogleBook | null> => {
  const googleBooksAPIJSON: GaxiosResponse<books_v1.Schema$Volumes> =
    await book.volumes.list({
      q: `isbn:${isbn}`,
    });

  const googleBook = googleBooksAPIJSON?.data?.items;

  if (googleBook?.length === 1) return googleBook[0]?.volumeInfo as GoogleBook;

  return null;
};
