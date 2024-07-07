import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { detailsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function deleteDetail(
  where: Prisma.DetailsWhereUniqueInput
) {
  return await prisma.details.update({
    where,
    data: {
      published: false
    },
    include: detailsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteDetail({ id: params.id });

  return NextResponse.json('');
}