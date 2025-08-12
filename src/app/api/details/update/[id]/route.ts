import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { detailsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateDetail(
  where: Prisma.DetailsWhereUniqueInput,
  data: Prisma.DetailsUpdateInput
) {
  return await prisma.details.update({
    where,
    data,
    include: detailsInclude,
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const detail = await updateDetail({ id: params.id }, await req.json());

  if (!detail) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.detail(detail);
  return NextResponse.json(responseData);
}
