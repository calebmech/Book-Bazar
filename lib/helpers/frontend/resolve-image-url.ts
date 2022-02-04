import { PopulatedBook } from "@lib/services/book"

export function resolveImageUrl(book: PopulatedBook | null | undefined): string {
  if (!book || !book.imageUrl) return 'https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=9781264595310';
  const { googleBook } = book;
  if (googleBook && googleBook.imageLinks) {
    return googleBook.imageLinks.thumbnail ?? 
      googleBook.imageLinks.smallThumbnail ??
      ""
  }
  return book.imageUrl;
}
