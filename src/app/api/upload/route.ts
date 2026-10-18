import { guardAdminRequest } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';

import { UploadLogic } from '@/app/api/upload/UploadLogic';

export async function POST(req: Request) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const formData = await req.formData();

  const uploadResult = await UploadLogic.uploadImages(formData);

  return NextResponse.json(uploadResult);
}
