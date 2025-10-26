import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PlatformsLogic } from './../../PlatformsLogic';

export async function GET(_req: NextRequest) {
  const platforms = await PlatformsLogic.findPlatforms();

  if (!platforms.length) {
    return NextResponse.json([]);
  }

  const responseData = platforms.map(PlatformsLogic.toPlatform);
  return NextResponse.json(responseData);
}
