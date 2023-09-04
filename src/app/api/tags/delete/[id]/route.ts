import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { tagsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function deleteTag(
  where: Prisma.TagsWhereUniqueInput
) {
  return await prisma.tags.update({
    where,
    data: {
      published: false
    },
    include: tagsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteTag({ id: params.id });

  return NextResponse.json('');
}