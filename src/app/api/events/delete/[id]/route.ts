import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { eventsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function deleteEvent(
  where: Prisma.EventsWhereUniqueInput
) {
  return await prisma.events.update({
    where,
    data: {
      published: false
    },
    include: eventsInclude
  });
}

export async function GET(_req: NextRequest, { params }) {
  await deleteEvent({ id: params.id });

  return NextResponse.json('');
}