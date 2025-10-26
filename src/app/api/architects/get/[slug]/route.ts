import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';

export async function GET(_req: NextRequest, props) {
  const { slug } = await props.params;

  const architect = await ArchitectsLogic.findArchitect({ slug });

  if (!architect) {
    return NextResponse.json('');
  }

  const responseData = ArchitectsLogic.toBaseArchitect(architect);
  return NextResponse.json(responseData);
}
