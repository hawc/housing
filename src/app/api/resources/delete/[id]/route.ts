import { ResourcesLogic } from '@/app/api/resources/ResourcesLogic';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_req: NextRequest, props) {
  const { id } = await props.params;

  await ResourcesLogic.deleteResource({ id });

  return NextResponse.json('');
}
