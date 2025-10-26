import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LocationsLogic } from '@/app/api/locations/LocationsLogic';

export async function GET(_req: NextRequest) {
  const locations = await LocationsLogic.findLocations();

  if (!locations.length) {
    return NextResponse.json([]);
  }

  const responseData = locations.map(LocationsLogic.toBaseLocation);
  return NextResponse.json(responseData);
}
