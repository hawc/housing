import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { TagsLogic } from '@/app/api/tags/TagsLogic';

export async function GET(_req: NextRequest) {
  const tags = await TagsLogic.findTags();

  if (!tags.length) {
    return NextResponse.json([]);
  }

  const responseData = tags.map(TagsLogic.toBaseTag);
  return NextResponse.json(responseData);
}
