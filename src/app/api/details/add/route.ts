import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DetailsLogic } from './../DetailsLogic';

import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const detail = await DetailsLogic.addDetail(data);

  if (!detail) {
    return NextResponse.json('');
  }
  
  const responseData = baseTransformers.detail(detail);
  return NextResponse.json(responseData);
}
