import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { architectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findArchitect(where: Prisma.ArchitectsWhereUniqueInput) {
  return await prisma.architects.findUnique({
    where,
    include: architectsInclude,
  });
}

export async function GET(_req: NextRequest, props) {
  const params = await props.params;
  const architect = await findArchitect({ slug: params.slug });
  if (!architect) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.architect(architect);
  return NextResponse.json(responseData);
}
