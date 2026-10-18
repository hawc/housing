import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function POST(req: NextRequest, props) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const { settlementId, architectId } = await props.params;
  const data = await req.json();

  await SettlementsLogic.addSettlementsOnArchitect({
    settlementId,
    architectId,
    ...data,
  });

  return NextResponse.json('');
}
