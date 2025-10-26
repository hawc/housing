import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LocationsLogic } from '@/app/api/locations/LocationsLogic';

export async function GET(_req: NextRequest, props) {
  const { id } = await props.params;

  await LocationsLogic.deleteLocation({ id });

  return NextResponse.json('');
}
