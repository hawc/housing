import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ResourceTypesLogic } from '@/app/api/resourceTypes/ResourceTypesLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const resourceTypes = await ResourceTypesLogic.findResourceTypes();

  if (!resourceTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = resourceTypes.map(baseTransformers.resourceType);
  return NextResponse.json(responseData);
}
