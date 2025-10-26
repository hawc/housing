import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function GET(_req: NextRequest, props) {
  const { slug } = await props.params;

  const settlement = await SettlementsLogic.findSettlement({ slug });

  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = SettlementsLogic.toBaseSettlement(settlement);
  return NextResponse.json(responseData);
}
