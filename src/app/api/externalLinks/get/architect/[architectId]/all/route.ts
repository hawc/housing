import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { externalLinksInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findExternalLinks(where: Prisma.ExternalLinksWhereInput) {
  return await prisma.externalLinks.findMany({
    where,
    include: externalLinksInclude,
  });
}

export async function GET(_req: NextRequest, props) {
  const params = await props.params;
  const externalLinks = await findExternalLinks({
    architectId: params.architectId,
  });
  if (!externalLinks) {
    return NextResponse.json([]);
  }

  const responseData = externalLinks.map(baseTransformers.externalLink);
  return NextResponse.json(responseData);
}
