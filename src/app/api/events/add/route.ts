import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { eventsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function addEvent(
  data: Prisma.EventsUncheckedCreateInput
) {
  return await prisma.events.create({
    data: {
      name: data.name,
      description: data.description,
      source: data.source,
      settlementId: data.settlementId,
      eventTypeId: data.eventTypeId,
      eventDate: data.eventDate
    },
    include: eventsInclude
  });
}

export async function POST(req: NextRequest) {
  const event = await addEvent(await req.json());

  if (!event) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.event(event);
  return NextResponse.json(responseData);
}