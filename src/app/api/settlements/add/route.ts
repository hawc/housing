import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const settlement = await SettlementsLogic.createSettlement(data);

  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.settlement(settlement);
  return NextResponse.json(responseData);
}
