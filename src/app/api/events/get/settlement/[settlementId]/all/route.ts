import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { eventsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function findEvents(
  where: Prisma.EventsWhereInput
) {
  return await prisma.events.findMany({
    where,
    include: eventsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  const events = await findEvents({ settlementId: params.settlementId });
  if (!events) {
    return NextResponse.json([]);
  }

  const responseData = events.map(baseTransformers.event);
  return NextResponse.json(responseData);
}