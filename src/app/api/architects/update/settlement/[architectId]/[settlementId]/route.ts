import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';

export async function POST(req: NextRequest, props) {
  const { architectId, settlementId } = await props.params;
  
  await ArchitectsLogic.updateSettlementsOnArchitect(
    {
      settlementId_architectId: {
        settlementId,
        architectId,
      },
    },
    await req.json()
  );

  return NextResponse.json('');
}
