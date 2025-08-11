import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { settlementsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';
import { slugify } from '@/utils/slugify';

async function createSettlement(
  data: Prisma.SettlementsCreateInput
) {
  return await prisma.settlements.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description
    },
    include: settlementsInclude
  });
}

export async function POST(req: NextRequest) {
  const settlement = await createSettlement(await req.json());

  if (!settlement) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.settlement(settlement);
  return NextResponse.json(responseData);
}