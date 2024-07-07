import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { resourcesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateResource(
  where: Prisma.ResourcesWhereUniqueInput,
  data: Prisma.ResourcesUpdateInput
) {
  return await prisma.resources.update({
    where,
    data,
    include: resourcesInclude
  });
}

export async function POST(req: NextRequest, { params }) {
  const resource = await updateResource({ id: params.id }, await req.json());

  if (!resource) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.resource(resource);
  return NextResponse.json(responseData);
}