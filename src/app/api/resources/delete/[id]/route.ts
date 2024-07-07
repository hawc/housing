import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { resourcesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function deleteResource(
  where: Prisma.ResourcesWhereUniqueInput
) {
  return await prisma.resources.update({
    where,
    data: {
      published: false
    },
    include: resourcesInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteResource({ id: params.id });

  return NextResponse.json('');
}