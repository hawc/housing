import { TagsLogic } from '@/app/api/tags/TagsLogic';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest, props) {
  const { id } = await props.params;
  const data = await req.json();

  const tag = await TagsLogic.updateTag({ id }, data);

  if (!tag) {
    return NextResponse.json('');
  }
  
  const responseData = baseTransformers.tag(tag);
  return NextResponse.json(responseData);
}
