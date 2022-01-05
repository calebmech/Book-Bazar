export function isValidISBN(isbn: string) {
  if (isbn.length == 13 && isbn.match(/^[0-9]+$/)) return true;
  return false;
}
