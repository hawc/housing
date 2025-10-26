import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ResourceTypesLogic } from '@/app/api/resourceTypes/ResourceTypesLogic';

export async function GET(_req: NextRequest) {
  const resourceTypes = await ResourceTypesLogic.findResourceTypes();

  if (!resourceTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = resourceTypes.map(ResourceTypesLogic.toBaseResourceType);
  return NextResponse.json(responseData);
}
