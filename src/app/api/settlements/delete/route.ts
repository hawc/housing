import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { settlementsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';


async function deleteSettlement(
  where: Prisma.SettlementsWhereUniqueInput
) {
  return await prisma.settlements.update({
    where,
    data: {
      published: false
    },
    include: settlementsInclude
  });
}

export async function POST(_req: NextRequest, { params }) {
  await deleteSettlement({ slug: params.slug });

  return NextResponse.json('');
}