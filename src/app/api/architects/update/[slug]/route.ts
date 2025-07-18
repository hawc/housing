import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { architectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateArchitect(
  where: Prisma.ArchitectsWhereUniqueInput,
  data: Prisma.ArchitectsUpdateInput
) {
  return await prisma.architects.update({
    where,
    data,
    include: architectsInclude
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const architect = await updateArchitect({ slug: params.slug }, await req.json());

  if (!architect) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.architect(architect);
  return NextResponse.json(responseData);
}