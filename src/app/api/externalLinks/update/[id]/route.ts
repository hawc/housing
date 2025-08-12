import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { externalLinksInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateExternalLink(
  where: Prisma.ExternalLinksWhereUniqueInput,
  data: Prisma.ExternalLinksUpdateInput
) {
  return await prisma.externalLinks.update({
    where,
    data,
    include: externalLinksInclude,
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const externalLink = await updateExternalLink(
    { id: params.id },
    await req.json()
  );

  if (!externalLink) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.externalLink(externalLink);
  return NextResponse.json(responseData);
}
