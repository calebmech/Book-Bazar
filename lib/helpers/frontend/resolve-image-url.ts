import { PopulatedBook } from "@lib/services/book";

export function resolveImageUrl(
  book: PopulatedBook | null | undefined
): string {

  // just defining this as a campus store book with no image, feel free to replace this with something better
  const fallback =
    "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=9781264595310";

  if (!book || !book.imageUrl) return fallback;
  const { googleBook } = book;
  if (googleBook && googleBook.imageLinks) {
    return (
      googleBook.imageLinks.extraLarge ??
      googleBook.imageLinks.large ??
      googleBook.imageLinks.medium ??
      googleBook.imageLinks.thumbnail ??
      googleBook.imageLinks.small ??
      googleBook.imageLinks.smallThumbnail ??
      fallback
    );
  }
  return book.imageUrl;
}
