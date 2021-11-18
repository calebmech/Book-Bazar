/**
 * Splits the array into pages of size `pageLength`, then returns the `page`th page.
 *
 * @param array the array to paginate
 * @param pageLength the number of each items on each page, must be a positive integer
 * @param page which page to get, must be a non-negative integer
 * @returns the elements of the array on the given page
 */
export function paginate<Type>(
  array: Type[],
  pageLength: number,
  page: number
): Type[] {
  if (page < 0 || pageLength < 1) {
    throw new Error("Invalid params");
  }
  const fullLength = array.length;
  let endBound = (page + 1) * pageLength;
  endBound = endBound > fullLength ? fullLength : endBound;
  return array.slice(page * pageLength, endBound);
}
