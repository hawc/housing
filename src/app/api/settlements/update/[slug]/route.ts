import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function POST(req: NextRequest, props) {
  const { slug } = await props.params;
  const data = await req.json();

  const settlement = await SettlementsLogic.updateSettlement({ slug }, data);

  if (!settlement) {
    return NextResponse.json('');
  }

  const responseData = SettlementsLogic.toBaseSettlement(settlement);
  return NextResponse.json(responseData);
}
