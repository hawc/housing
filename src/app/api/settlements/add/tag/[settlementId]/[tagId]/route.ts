import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { settlementsOnTagsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function addSettlementsOnTag(
  data: Prisma.SettlementsOnTagsUncheckedCreateInput
) {
  return await prisma.settlementsOnTags.create({
    data: data,
    include: settlementsOnTagsInclude
  });
}

export async function GET(_req: NextRequest, props) {
  const params = await props.params;
  await addSettlementsOnTag({ settlementId: params.settlementId, tagId: params.tagId });

  return NextResponse.json('');
}