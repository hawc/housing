import { NextRequest, NextResponse } from 'next/server';

import { locationsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

import { baseTransformers } from '@/app/api/db/transformers';

export async function findLocations() {
  return await prisma.locations.findMany({
    where: {
      published: true
    },
    include: locationsInclude
  });
}

export async function GET(_req: NextRequest) {
  const locations = await findLocations();
  if (!locations.length) {
    return NextResponse.json('');
  }

  const responseData = locations.map(baseTransformers.location);
  return NextResponse.json(responseData);
}