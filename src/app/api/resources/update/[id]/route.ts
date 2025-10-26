import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ResourcesLogic } from '@/app/api/resources/ResourcesLogic';
import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest, props) {
  const { id } = await props.params;
  const data = await req.json();

  const resource = await ResourcesLogic.updateResource({ id }, data);

  if (!resource) {
    return NextResponse.json('');
  }

  const responseData = baseTransformers.resource(resource);
  return NextResponse.json(responseData);
}
