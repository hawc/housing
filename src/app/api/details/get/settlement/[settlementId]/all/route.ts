import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { detailsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findDetails(
  where: Prisma.DetailsWhereInput
) {
  return await prisma.details.findMany({
    where,
    include: detailsInclude
  });
}

export async function GET(_req: NextRequest, props) {
  const params = await props.params;
  const details = await findDetails({ settlementId: params.settlementId });
  if (!details) {
    return NextResponse.json([]);
  }

  const responseData = details.map(baseTransformers.detail);
  return NextResponse.json(responseData);
}