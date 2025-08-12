import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { locationsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateLocation(
  where: Prisma.LocationsWhereUniqueInput,
  data: Prisma.LocationsUpdateInput
) {
  return await prisma.locations.update({
    where,
    data,
    include: locationsInclude,
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const location = await updateLocation({ id: params.id }, await req.json());

  if (!location) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.location(location);
  return NextResponse.json(responseData);
}
