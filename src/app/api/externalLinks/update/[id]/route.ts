import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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
    include: externalLinksInclude
  });
}

export async function POST(req: NextRequest, { params }) {
  const externalLink = await updateExternalLink({ id: params.id }, await req.json());

  if (!externalLink) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.externalLink(externalLink);
  return NextResponse.json(responseData);
}