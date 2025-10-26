import { LocationsLogic } from '@/app/api/locations/LocationsLogic';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest, props) {
  const { id } = await props.params;
  const data = await req.json();

  const location = await LocationsLogic.updateLocation({ id }, data);

  if (!location) {
    return NextResponse.json('');
  }

  const responseData = baseTransformers.location(location);
  return NextResponse.json(responseData);
}
