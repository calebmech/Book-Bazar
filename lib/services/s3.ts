import * as AWS from "aws-sdk";
import { AWS_ACCESS_KEY_ID_BOOKBAZAR, AWS_REGION_BOOKBAZAR, AWS_SECRET_ACCESS_KEY_BOOKBAZAR } from "@lib/helpers/backend/env";

AWS.config.update({
  'credentials': {
      'accessKeyId': AWS_ACCESS_KEY_ID_BOOKBAZAR,
      'secretAccessKey': AWS_SECRET_ACCESS_KEY_BOOKBAZAR
    },
  'region': AWS_REGION_BOOKBAZAR
})

export const s3: AWS.S3 = (global as any).s3 || new AWS.S3();

if (process.env.NODE_ENV !== "production") (global as any).s3 = s3;