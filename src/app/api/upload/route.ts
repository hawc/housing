import { NextResponse } from 'next/server';

import { saveToCloudinary } from '@/lib/cloudinary';

export interface ImageResponse {
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  placeholder: boolean;
  url: string;
  folder: string;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const formDataImages = formData.getAll('image');
  const formDataCategory = String(formData.get('category') ?? 'unsorted');
  const images: ImageResponse[] = [];
  try {
    for (const formDataEntryValue of formDataImages) {
      if (
        typeof formDataEntryValue === 'object' &&
        formDataEntryValue &&
        'arrayBuffer' in formDataEntryValue
      ) {
        const file = formDataEntryValue;
        const fileType = 'image';
        const name = file.name.split('.')[0];
        const ext = file.name.split('.')[1];
        const buffer = Buffer.from(await file.arrayBuffer());
        const cloudinaryResponse = await saveToCloudinary(
          {
            src: `data:${fileType}/${ext};base64,${Buffer.from(buffer).toString(
              'base64'
            )}`,
            name: name,
          },
          formDataCategory
        );
        if (cloudinaryResponse?.secure_url) {
          images.push({
            width: cloudinaryResponse.width,
            height: cloudinaryResponse.height,
            format: cloudinaryResponse.format,
            resource_type: cloudinaryResponse.resource_type,
            created_at: cloudinaryResponse.created_at,
            tags: cloudinaryResponse.tags,
            bytes: cloudinaryResponse.bytes,
            placeholder: cloudinaryResponse.placeholder,
            url: cloudinaryResponse.secure_url,
            folder: cloudinaryResponse.folder,
          });
        }
      }
    }
    return NextResponse.json({ success: true, images });
  } catch {
    return NextResponse.json({ success: false, images });
  }
}
