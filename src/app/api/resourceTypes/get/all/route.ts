import { NextRequest, NextResponse } from 'next/server';

import { resourceTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findResourceTypes() {
  return await prisma.resourceTypes.findMany({
    where: {
      published: true
    },
    include: resourceTypesInclude
  });
}

export async function GET(_req: NextRequest) {
  const resourceTypes = await findResourceTypes();
  if (!resourceTypes.length) {
    return NextResponse.json('');
  }

  const responseData = resourceTypes.map(baseTransformers.resourceType);
  return NextResponse.json(responseData);
}