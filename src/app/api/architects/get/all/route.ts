import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';

export async function GET(_req: NextRequest) {
  const architects = await ArchitectsLogic.findArchitects();

  if (!architects.length) {
    return NextResponse.json([]);
  }

  const responseData = architects.map(ArchitectsLogic.toBaseArchitect);
  return NextResponse.json(responseData);
}
