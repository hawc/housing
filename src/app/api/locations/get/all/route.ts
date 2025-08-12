import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { locationsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findLocations() {
  return await prisma.locations.findMany({
    where: {
      published: true,
      settlement: {
        published: true,
      },
    },
    include: locationsInclude,
  });
}

export async function GET(_req: NextRequest) {
  const locations = await findLocations();
  if (!locations.length) {
    return NextResponse.json([]);
  }

  const responseData = locations.map(baseTransformers.location);
  return NextResponse.json(responseData);
}
