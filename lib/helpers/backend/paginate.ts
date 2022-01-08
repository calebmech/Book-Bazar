export function paginateResults(array: any[], length: number, page: number) {
  const start: number = page*length;
  const end: number = (page+1)*length;
  return array.slice(start, end);
}