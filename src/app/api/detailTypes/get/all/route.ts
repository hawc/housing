import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { DetailTypesLogic } from '@/app/api/detailTypes/DetailTypesLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const detailTypes = await DetailTypesLogic.findDetailTypes();
  
  if (!detailTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = detailTypes.map(baseTransformers.detailType);
  return NextResponse.json(responseData);
}
