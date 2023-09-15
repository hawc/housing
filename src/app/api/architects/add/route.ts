import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { architectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';
import { slugify } from '@/lib/utils';

async function createArchitect(
  data: Prisma.ArchitectsCreateInput
) {
  return await prisma.architects.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description
    },
    include: architectsInclude
  });
}

export async function POST(req: NextRequest) {
  const architect = await createArchitect(await req.json());

  if (!architect) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.architect(architect);
  return NextResponse.json(responseData);
}