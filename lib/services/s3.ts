import * as AWS from "aws-sdk";

export const s3: AWS.S3 =
  (global as any).s3 || new AWS.S3();

if (process.env.NODE_ENV !== "production") (global as any).s3 = s3;
