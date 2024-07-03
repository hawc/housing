import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { externalLinksInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function deleteExternalLink(
  where: Prisma.ExternalLinksWhereUniqueInput
) {
  return await prisma.externalLinks.update({
    where,
    data: {
      published: false
    },
    include: externalLinksInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteExternalLink({ id: params.id });

  return NextResponse.json('');
}