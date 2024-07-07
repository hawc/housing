import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { platformsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findPlatforms() {
  return await prisma.platforms.findMany({
    where: {
      published: true
    },
    include: platformsInclude
  });
}

export async function GET(_req: NextRequest) {
  const platforms = await findPlatforms();
  if (!platforms.length) {
    return NextResponse.json([]);
  }

  const responseData = platforms.map(baseTransformers.platform);
  return NextResponse.json(responseData);
}