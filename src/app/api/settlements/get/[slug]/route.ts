import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest, props) {
  const { slug } = await props.params;

  const settlement = await SettlementsLogic.findSettlement({ slug });

  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.settlement(settlement);
  return NextResponse.json(responseData);
}
