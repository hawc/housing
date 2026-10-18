import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LocationsLogic } from '@/app/api/locations/LocationsLogic';

export async function POST(req: NextRequest) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const data = await req.json();

  const location = await LocationsLogic.createLocation(data);

  if (!location) {
    return NextResponse.json('');
  }

  const responseData = LocationsLogic.toBaseLocation(location);
  return NextResponse.json(responseData);
}
