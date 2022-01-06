import * as AWS from "aws-sdk";

AWS.config.update({
  'credentials': {
      'accessKeyId': process.env.AWS_ACCESS_KEY_ID_BOOKBAZAR as string,
      'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY_BOOKBAZAR as string
    },
  'region': process.env.AWS_REGION_MYAPP
})

export const s3: AWS.S3 = (global as any).s3 || new AWS.S3();

if (process.env.NODE_ENV !== "production") (global as any).s3 = s3;