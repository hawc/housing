import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PlatformsLogic } from './../PlatformsLogic';

import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const platform = await PlatformsLogic.addPlatform(data);

  if (!platform) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.platform(platform);
  return NextResponse.json(responseData);
}
