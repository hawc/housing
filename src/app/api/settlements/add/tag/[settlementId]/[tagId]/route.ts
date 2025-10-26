import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';

export async function GET(_req: NextRequest, props) {
  const { settlementId, tagId } = await props.params;

  await SettlementsLogic.addSettlementsOnTag({
    settlementId,
    tagId,
  });

  return NextResponse.json('');
}
