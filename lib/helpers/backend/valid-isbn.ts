export function isValidISBN(isbn: string) {
  return (isbn.length == 13 && isbn.match(/^[0-9]+$/));
}
