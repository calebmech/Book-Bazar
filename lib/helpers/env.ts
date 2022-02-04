if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
  throw new Error("process.env.NEXT_PUBLIC_ALGOLIA_APP_ID must be set.");
}
export const NEXT_PUBLIC_ALGOLIA_APP_ID =
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;

if (!process.env.NEXT_PUBLIC_ALGOLIA_API_KEY) {
  throw new Error("process.env.NEXT_PUBLIC_ALGOLIA_API_KEY must be set.");
}
export const NEXT_PUBLIC_ALGOLIA_API_KEY =
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;

if (!process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME) {
  throw new Error("process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME must be set.");
}
export const NEXT_PUBLIC_ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

export const IS_E2E = process.env.IS_E2E === "true";
