import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { settlementsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

import { baseTransformers } from '@/app/api/db/transformers';

async function findSettlement(
  where: Prisma.SettlementsWhereUniqueInput
) {
  return await prisma.settlements.findUnique({
    where,
    include: settlementsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  const settlement = await findSettlement({ slug: params.slug });
  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.settlement(settlement);
  return NextResponse.json(responseData);
}