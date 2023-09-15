import { NextRequest, NextResponse } from 'next/server';

import { eventTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findEventTypes() {
  return await prisma.eventTypes.findMany({
    where: {
      published: true
    },
    include: eventTypesInclude
  });
}

export async function GET(_req: NextRequest) {
  const eventTypes = await findEventTypes();
  if (!eventTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = eventTypes.map(baseTransformers.eventType);
  return NextResponse.json(responseData);
}