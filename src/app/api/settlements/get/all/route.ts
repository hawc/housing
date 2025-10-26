import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const settlements = await SettlementsLogic.findSettlements();
  
  if (!settlements.length) {
    return NextResponse.json([]);
  }

  const responseData = settlements.map(baseTransformers.settlement);
  return NextResponse.json(responseData);
}
