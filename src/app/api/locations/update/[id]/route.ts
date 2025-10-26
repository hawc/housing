import { LocationsLogic } from '@/app/api/locations/LocationsLogic';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest, props) {
  const { id } = await props.params;
  const data = await req.json();

  const location = await LocationsLogic.updateLocation({ id }, data);

  if (!location) {
    return NextResponse.json('');
  }

  const responseData = LocationsLogic.toBaseLocation(location);
  return NextResponse.json(responseData);
}
