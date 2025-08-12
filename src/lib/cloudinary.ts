import logger from '@/lib/logger';
import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

interface UploadImage {
  src: string;
  name: string;
}

let cloudinaryInit;

function initCloudinary() {
  return cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export async function saveToCloudinary(image: UploadImage, category: string): Promise<UploadApiResponse> {
  if (!cloudinaryInit) {
    cloudinaryInit = initCloudinary();
  }

  const apiResponse = await cloudinary.uploader.upload(
    image.src,
    { filename_override: image.name, use_filename: true, folder: category, resource_type: 'image' },
    (error) => {
      if (error) {
        logger(error, 'Error uploading image to cloudinary.');
      }
    });

  return apiResponse;
}