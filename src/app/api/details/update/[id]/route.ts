import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { detailsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

import { baseTransformers } from '@/app/api/db/transformers';

async function updateDetail(
  where: Prisma.DetailsWhereUniqueInput,
  data: Prisma.DetailsUpdateInput
) {
  return await prisma.details.update({
    where,
    data,
    include: detailsInclude
  });
}

export async function POST(req: NextRequest, { params }) {
  const detail = await updateDetail({ id: params.id }, await req.json());

  if (!detail) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.detail(detail);
  return NextResponse.json(responseData);
}