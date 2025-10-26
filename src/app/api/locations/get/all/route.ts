import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LocationsLogic } from '@/app/api/locations/LocationsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const locations = await LocationsLogic.findLocations();

  if (!locations.length) {
    return NextResponse.json([]);
  }

  const responseData = locations.map(baseTransformers.location);
  return NextResponse.json(responseData);
}
