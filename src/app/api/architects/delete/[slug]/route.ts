import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { architectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';


async function deleteArchitect(
  where: Prisma.ArchitectsWhereUniqueInput
) {
  return await prisma.architects.update({
    where,
    data: {
      published: false
    },
    include: architectsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteArchitect({ slug: params.slug });

  return NextResponse.json('');
}