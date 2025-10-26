import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PlatformsLogic } from './../../PlatformsLogic';

import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest, props) {
  const { id } = await props.params;
  const data = await req.json();

  const platform = await PlatformsLogic.updatePlatform({ id }, data);

  if (!platform) {
    return NextResponse.json('');
  }

  const responseData = baseTransformers.platform(platform);
  return NextResponse.json(responseData);
}
