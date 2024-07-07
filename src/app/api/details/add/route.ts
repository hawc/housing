import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { detailsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function addDetail(
  data: Prisma.DetailsUncheckedCreateInput
) {
  return await prisma.details.create({
    data: {
      name: data.name,
      description: data.description,
      annotation: data.annotation,
      source: data.source,
      settlementId: data.settlementId,
      detailTypeId: data.detailTypeId,
      detailDate: data.detailDate
    },
    include: detailsInclude
  });
}

export async function POST(req: NextRequest) {
  const detail = await addDetail(await req.json());

  if (!detail) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.detail(detail);
  return NextResponse.json(responseData);
}