import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { tagsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateTag(
  where: Prisma.TagsWhereUniqueInput,
  data: Prisma.TagsUpdateInput
) {
  return await prisma.tags.update({
    where,
    data,
    include: tagsInclude
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const tag = await updateTag({ id: params.id }, await req.json());

  if (!tag) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.tag(tag);
  return NextResponse.json(responseData);
}