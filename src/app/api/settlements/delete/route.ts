import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function POST(_req: NextRequest, props) {
  const denied = await guardAdminRequest(_req);
  if (denied) return denied;

  const { slug } = await props.params;

  await SettlementsLogic.deleteSettlement({ slug });

  return NextResponse.json('');
}
