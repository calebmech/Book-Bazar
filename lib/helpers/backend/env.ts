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
