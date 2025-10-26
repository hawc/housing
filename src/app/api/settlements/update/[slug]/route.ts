import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest, props) {
  const { slug } = await props.params;
  const data = await req.json();
  
  const settlement = await SettlementsLogic.updateSettlement(
    { slug },
    data
  );

  if (!settlement) {
    return NextResponse.json('');
  }

  const responseData = baseTransformers.settlement(settlement);
  return NextResponse.json(responseData);
}
