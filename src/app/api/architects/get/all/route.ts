import { NextRequest, NextResponse } from 'next/server';

import { architectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

import { baseTransformers } from '@/app/api/db/transformers';

async function findArchitects() {
  return await prisma.architects.findMany({
    where: {
      published: true
    },
    include: architectsInclude
  });
}

export async function GET(_req: NextRequest) {
  const architects = await findArchitects();
  if (!architects.length) {
    return NextResponse.json('');
  }

  const responseData = architects.map(baseTransformers.architect);
  return NextResponse.json(responseData);
}