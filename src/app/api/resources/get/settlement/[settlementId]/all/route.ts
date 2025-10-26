import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ResourcesLogic } from '@/app/api/resources/ResourcesLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest, props) {
  const { settlementId } = await props.params;

  const resources = await ResourcesLogic.findResources({ settlementId });

  if (!resources) {
    return NextResponse.json([]);
  }

  const responseData = resources.map(baseTransformers.resource);
  return NextResponse.json(responseData);
}
