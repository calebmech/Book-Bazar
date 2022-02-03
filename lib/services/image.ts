import { s3 } from "./s3";
import sharp from "sharp";
import { v4 } from "uuid";
import {
  AWS_BUCKET_NAME_BOOKBAZAR,
  AWS_REGION_BOOKBAZAR,
} from "@lib/helpers/backend/env";
import { IMAGE_UPLOAD_WIDTH } from "@lib/helpers/constants";

export async function uploadImage(image: Buffer): Promise<string> {
  const buffer = await resizeImage(image);
  const key = v4();
  const params = {
    Body: buffer,
    Bucket: AWS_BUCKET_NAME_BOOKBAZAR,
    Key: key,
    ServerSideEncryption: "AES256",
    StorageClass: "STANDARD_IA",
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  return new Promise(function (resolve, reject) {
    s3.putObject(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        const link = `https://${AWS_BUCKET_NAME_BOOKBAZAR}.s3.${AWS_REGION_BOOKBAZAR}.amazonaws.com/${key}`;
        resolve(link);
      }
    });
  });
}

export async function resizeImage(image: Buffer): Promise<Buffer> {
  return sharp(image).rotate().resize(IMAGE_UPLOAD_WIDTH).jpeg().toBuffer();
}

export async function deleteImage(link: string) {
  const url = new URL(link);
  const key = url.pathname.substring(1);

  const params = {
    Bucket: AWS_BUCKET_NAME_BOOKBAZAR,
    Key: key,
  };

  return new Promise(function (resolve, reject) {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
}
