import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { platformsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function deletePlatform(where: Prisma.PlatformsWhereUniqueInput) {
  return await prisma.platforms.update({
    where,
    data: {
      published: false,
    },
    include: platformsInclude,
  });
}

export async function GET(_req: NextRequest, props) {
  const params = await props.params;
  await deletePlatform({ id: params.id });

  return NextResponse.json('');
}
