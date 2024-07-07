import type { Prisma } from '@prisma/client';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { resourcesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findResources(
  where: Prisma.ResourcesWhereInput
) {
  return await prisma.resources.findMany({
    where,
    include: resourcesInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  const resources = await findResources({ settlementId: params.settlementId });
  if (!resources) {
    return NextResponse.json([]);
  }

  const responseData = resources.map(baseTransformers.resource);
  return NextResponse.json(responseData);
}