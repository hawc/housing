import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LocationsLogic } from '@/app/api/locations/LocationsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const location = await LocationsLogic.createLocation(data);

  if (!location) {
    return NextResponse.json('');
  }
  
  const responseData = baseTransformers.location(location);
  return NextResponse.json(responseData);
}
