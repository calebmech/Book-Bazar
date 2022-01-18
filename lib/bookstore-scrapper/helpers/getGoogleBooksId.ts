import { google } from "googleapis";

const book = google.books({
  version: "v1",
});

export const getGoogleBooksId = async (
  isbn: string
): Promise<string | null> => {
  const googleBooksAPIJSON = await book.volumes.list({
    q: `isbn:${isbn}`,
  });

  const googleBook = googleBooksAPIJSON?.data?.items;

  if (googleBook && googleBook.length > 0) {
    return googleBook[0]?.id as string;
  }

  return null;
};
