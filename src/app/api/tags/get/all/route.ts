import { NextRequest, NextResponse } from 'next/server';

import { tagsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

import { baseTransformers } from '@/app/api/db/transformers';

async function findTags() {
  return await prisma.tags.findMany({
    where: {
      published: true
    },
    include: tagsInclude
  });
}

export async function GET(_req: NextRequest) {
  const tags = await findTags();
  if (!tags.length) {
    return NextResponse.json('');
  }

  const responseData = tags.map(baseTransformers.tag);
  return NextResponse.json(responseData);
}