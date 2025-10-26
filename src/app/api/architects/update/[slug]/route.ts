import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';

export async function POST(req: NextRequest, props) {
  const { slug } = await props.params;
  const data = await req.json();

  const architect = await ArchitectsLogic.updateArchitect({ slug }, data);

  if (!architect) {
    return NextResponse.json('');
  }

  const responseData = ArchitectsLogic.toBaseArchitect(architect);
  return NextResponse.json(responseData);
}
