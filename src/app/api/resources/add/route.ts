import { ResourcesLogic } from '@/app/api/resources/ResourcesLogic';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const resource = await ResourcesLogic.addResource(data);

  if (!resource) {
    return NextResponse.json('');
  }

  const responseData = ResourcesLogic.toBaseResource(resource);
  return NextResponse.json(responseData);
}
