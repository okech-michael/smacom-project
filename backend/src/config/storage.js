import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import streamifier from 'streamifier';

dotenv.config();

const useS3 = Boolean(process.env.AWS_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION);
const useCloudinary = Boolean(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));

if (useCloudinary) {
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    url: process.env.CLOUDINARY_URL,
  });
}

import fs from 'fs/promises';
import path from 'path';

const s3Client = useS3
  ? new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

const useLocalStorage = !useS3 && !useCloudinary;
const localUploadDir = path.resolve(process.cwd(), 'uploads');

export const uploadOptions = {
  storage: undefined,
};

export const uploadFile = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (useS3 && s3Client) {
    const key = `${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });
    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  if (useCloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'smacom',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  if (useLocalStorage) {
    await fs.mkdir(localUploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(localUploadDir, filename);
    await fs.writeFile(filePath, file.buffer);
    const baseUrl = (process.env.CLIENT_URL).replace(/\/$/, '');
    return `${baseUrl}/uploads/${filename}`;
  }

  throw new Error('No file storage provider configured. Set AWS or Cloudinary environment variables.');
};
