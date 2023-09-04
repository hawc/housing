import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { locationsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';


async function deleteLocation(
  where: Prisma.LocationsWhereUniqueInput
) {
  return await prisma.locations.update({
    where,
    data: {
      published: false
    },
    include: locationsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteLocation({ id: params.id });

  return NextResponse.json('');
}