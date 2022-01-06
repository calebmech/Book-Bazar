import { s3 } from './s3';
import sharp from 'sharp';
const AWS_S3_BUCKET_NAME = "book-bazar-images";
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 400;

export async function uploadImage(image: string, key: string): Promise<string>
{
  const buffer = await resizeImage(image);

  const params = {
    Body: buffer, 
    Bucket: AWS_S3_BUCKET_NAME, 
    Key: key, 
    ServerSideEncryption: 'AES256', 
    StorageClass: 'STANDARD_IA',
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  };

  return new Promise(function(resolve, reject) {
    s3.putObject(params, function(err, data){
      if (err) {
        reject(err);
      }
      else {
        const link = `https://${AWS_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${key}`;
        resolve(link);
      }
    })
  })
}

async function resizeImage(image: string): Promise<Buffer> {
  return sharp(image)
    .rotate()
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT)
    .png()
    .toBuffer();
}

export async function deleteImage(key: string) {
  const params = {
    Bucket: AWS_S3_BUCKET_NAME, 
    Key: key
  };

  return new Promise(function(resolve, reject) {
    s3.deleteObject(params, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(null);
      }
    })
  })
}