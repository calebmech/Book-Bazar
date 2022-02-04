if (!process.env.BASE_URL && !process.env.VERCEL_URL) {
  throw new Error(
    "process.env.BASE_URL or process.env.VERCEL_URL must be set."
  );
}
export const BASE_URL = process.env.BASE_URL || process.env.VERCEL_URL;

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("process.env.SENDGRID_API_KEY must be set.");
}
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!process.env.SENDGRID_EMAIL_FROM) {
  throw new Error("process.env.SENDGRID_EMAIL_FROM must be set.");
}
export const SENDGRID_EMAIL_FROM = process.env.SENDGRID_EMAIL_FROM;

if (!process.env.SENDGRID_TEMPLATE_ID) {
  throw new Error("process.env.SENDGRID_TEMPLATE_ID must be set.");
}
export const SENDGRID_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID;

if (!process.env.AWS_ACCESS_KEY_ID_BOOKBAZAR) {
  throw new Error("process.env.AWS_ACCESS_KEY_ID_BOOKBAZAR must be set.");
}
export const AWS_ACCESS_KEY_ID_BOOKBAZAR =
  process.env.AWS_ACCESS_KEY_ID_BOOKBAZAR;

if (!process.env.AWS_SECRET_ACCESS_KEY_BOOKBAZAR) {
  throw new Error("process.env.AWS_SECRET_ACCESS_KEY_BOOKBAZAR must be set.");
}
export const AWS_SECRET_ACCESS_KEY_BOOKBAZAR =
  process.env.AWS_SECRET_ACCESS_KEY_BOOKBAZAR;

if (!process.env.AWS_REGION_BOOKBAZAR) {
  throw new Error("process.env.AWS_REGION_BOOKBAZAR must be set.");
}
export const AWS_REGION_BOOKBAZAR = process.env.AWS_REGION_BOOKBAZAR;

if (!process.env.AWS_BUCKET_NAME_BOOKBAZAR) {
  throw new Error("process.env.AWS_BUCKET_NAME_BOOKBAZAR must be set.");
}
export const AWS_BUCKET_NAME_BOOKBAZAR = process.env.AWS_BUCKET_NAME_BOOKBAZAR;

if (!process.env.ALGOLIA_APP_ID) {
  throw new Error("process.env.ALGOLIA_APP_ID must be set.");
}
export const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;

if (!process.env.ALGOLIA_API_KEY) {
  throw new Error("process.env.ALGOLIA_API_KEY must be set.");
}
export const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;

if (!process.env.ALGOLIA_INDEX_NAME) {
  throw new Error("process.env.ALGOLIA_INDEX_NAME must be set.");
}
export const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

export const IS_E2E: boolean = process.env.IS_E2E === "true";
