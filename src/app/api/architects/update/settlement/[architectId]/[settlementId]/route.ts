import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

async function updateSettlementsOnArchitect(
  where: Prisma.SettlementsOnArchitectsWhereUniqueInput,
  data: Prisma.SettlementsOnArchitectsUpdateInput
) {
  return await prisma.settlementsOnArchitects.update({
    where,
    data,
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  await updateSettlementsOnArchitect(
    {
      settlementId_architectId: {
        settlementId: params.settlementId,
        architectId: params.architectId,
      },
    },
    await req.json()
  );

  return NextResponse.json('');
}
