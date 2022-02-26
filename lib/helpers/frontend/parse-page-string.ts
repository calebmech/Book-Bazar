export function parsePageString(
  pageString: string | string[] | undefined
): number {
  if (!pageString || Array.isArray(pageString)) {
    return 0;
  }
  return Number.parseInt(pageString);
}
