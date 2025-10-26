import { NextResponse } from 'next/server';

import { UploadLogic } from '@/app/api/upload/UploadLogic';

export async function POST(req: Request) {
  const formData = await req.formData();

  const uploadResult = UploadLogic.uploadImages(formData);

  return NextResponse.json(uploadResult);
}
