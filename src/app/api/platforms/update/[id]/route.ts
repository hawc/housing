import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { platformsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updatePlatform(
  where: Prisma.PlatformsWhereUniqueInput,
  data: Prisma.PlatformsUpdateInput
) {
  return await prisma.platforms.update({
    where,
    data,
    include: platformsInclude
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const platform = await updatePlatform({ id: params.id }, await req.json());

  if (!platform) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.platform(platform);
  return NextResponse.json(responseData);
}