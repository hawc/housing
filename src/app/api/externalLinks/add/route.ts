import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { externalLinksInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function addExternalLink(
  data: Prisma.ExternalLinksUncheckedCreateInput
) {
  return await prisma.externalLinks.create({
    data: {
      name: data.name,
      description: data.description,
      url: data.url,
      platformId: data.platformId
    },
    include: externalLinksInclude
  });
}

export async function POST(req: NextRequest) {
  const externalLink = await addExternalLink(await req.json());

  if (!externalLink) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.externalLink(externalLink);
  return NextResponse.json(responseData);
}