import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DetailsLogic } from './../../../../DetailsLogic';

import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest, props) {
  const { settlementId } = await props.params;

  const details = await DetailsLogic.findDetails({ settlementId });

  if (!details) {
    return NextResponse.json([]);
  }

  const responseData = details.map(baseTransformers.detail);
  return NextResponse.json(responseData);
}
