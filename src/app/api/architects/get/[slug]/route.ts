import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest, props) {
  const { slug } = await props.params;

  const architect = await ArchitectsLogic.findArchitect({ slug });

  if (!architect) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.architect(architect);
  return NextResponse.json(responseData);
}
