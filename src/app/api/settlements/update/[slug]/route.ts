import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { settlementsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateSettlement(
  where: Prisma.SettlementsWhereUniqueInput,
  data: Prisma.SettlementsUpdateInput
) {
  return await prisma.settlements.update({
    where,
    data,
    include: settlementsInclude
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const settlement = await updateSettlement({ slug: params.slug }, await req.json());

  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.settlement(settlement);
  return NextResponse.json(responseData);
}