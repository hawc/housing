import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

async function updateSettlementsOnArchitect(
  where: Prisma.SettlementsOnArchitectsWhereUniqueInput,
  data: Prisma.SettlementsOnArchitectsUpdateInput
) {
  return await prisma.settlementsOnArchitects.update({
    where,
    data
  });
}

export async function POST(req: NextRequest, { params }) {
  await updateSettlementsOnArchitect({
    settlementId_architectId: {
      settlementId: params.settlementId,
      architectId: params.architectId,
    }
  }, await req.json());

  return NextResponse.json('');
}