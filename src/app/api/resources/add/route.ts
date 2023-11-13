import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { resourcesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function addResource(
  data: Prisma.ResourcesCreateInput
) {
  return await prisma.resources.create({
    data: {
      name: data.name,
      description: data.description,
      url: data.url,
      source: data.source,
      license: data.license,
      copyright: data.copyright,
      resourceType: data.resourceType,
      settlement: data.settlement
    },
    include: resourcesInclude
  });
}

export async function POST(req: NextRequest) {
  const resource = await addResource(await req.json());

  if (!resource) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.resource(resource);
  return NextResponse.json(responseData);
}