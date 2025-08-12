import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { locationsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function createLocation(data: Prisma.LocationsCreateInput) {
  return await prisma.locations.create({
    data: {
      lat: data.lat,
      lng: data.lng,
      name: data.name,
      address: data.address,
      district: data.district,
      zipCode: data.zipCode,
      city: data.city,
      state: data.state,
      settlement: data.settlement,
    },
    include: locationsInclude,
  });
}

export async function POST(req: NextRequest) {
  const location = await createLocation(await req.json());

  if (!location) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.location(location);
  return NextResponse.json(responseData);
}
