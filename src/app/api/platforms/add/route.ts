import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { platformsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';
import { slugify } from '@/lib/utils';

async function addPlatform(
  data: Prisma.PlatformsUncheckedCreateInput
) {
  return await prisma.platforms.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      url: data.url,
    },
    include: platformsInclude
  });
}

export async function POST(req: NextRequest) {
  const platform = await addPlatform(await req.json());

  if (!platform) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.platform(platform);
  return NextResponse.json(responseData);
}