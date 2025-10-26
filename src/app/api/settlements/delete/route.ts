import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function POST(_req: NextRequest, props) {
  const { slug } = await props.params;

  await SettlementsLogic.deleteSettlement({ slug });

  return NextResponse.json('');
}
