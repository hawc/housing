import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { TagsLogic } from '@/app/api/tags/TagsLogic';

export async function GET(_req: NextRequest, props) {
  const { id } = await props.params;

  await TagsLogic.deleteTag({ id });

  return NextResponse.json('');
}
