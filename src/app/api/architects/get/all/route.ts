import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const architects = await ArchitectsLogic.findArchitects();

  if (!architects.length) {
    return NextResponse.json([]);
  }

  const responseData = architects.map(baseTransformers.architect);
  return NextResponse.json(responseData);
}
