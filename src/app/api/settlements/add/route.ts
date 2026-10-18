import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function POST(req: NextRequest) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const data = await req.json();

  const settlement = await SettlementsLogic.createSettlement(data);

  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = SettlementsLogic.toBaseSettlement(settlement);
  return NextResponse.json(responseData);
}
