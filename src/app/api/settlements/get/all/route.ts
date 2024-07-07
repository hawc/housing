import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { settlementsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findSettlements() {
  return await prisma.settlements.findMany({
    where: {
      published: true
    },
    include: settlementsInclude
  });
}

export async function GET(_req: NextRequest) {
  const settlements = await findSettlements();
  if (!settlements.length) {
    return NextResponse.json([]);
  }

  const responseData = settlements.map(baseTransformers.settlement);
  return NextResponse.json(responseData);
}