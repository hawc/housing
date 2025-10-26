import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PlatformsLogic } from './../../PlatformsLogic';

import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const platforms = await PlatformsLogic.findPlatforms();

  if (!platforms.length) {
    return NextResponse.json([]);
  }

  const responseData = platforms.map(baseTransformers.platform);
  return NextResponse.json(responseData);
}
