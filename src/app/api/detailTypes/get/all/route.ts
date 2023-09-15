import { NextRequest, NextResponse } from 'next/server';

import { detailTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findDetailTypes() {
  return await prisma.detailTypes.findMany({
    where: {
      published: true
    },
    include: detailTypesInclude
  });
}

export async function GET(_req: NextRequest) {
  const detailTypes = await findDetailTypes();
  if (!detailTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = detailTypes.map(baseTransformers.detailType);
  return NextResponse.json(responseData);
}