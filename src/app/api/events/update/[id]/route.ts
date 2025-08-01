import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { eventsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { baseTransformers } from '@/lib/transformers';

async function updateEvent(
  where: Prisma.EventsWhereUniqueInput,
  data: Prisma.EventsUpdateInput
) {
  return await prisma.events.update({
    where,
    data,
    include: eventsInclude
  });
}

export async function POST(req: NextRequest, props) {
  const params = await props.params;
  const event = await updateEvent({ id: params.id }, await req.json());

  if (!event) {
    return NextResponse.json('');
  }
  const responseData = baseTransformers.event(event);
  return NextResponse.json(responseData);
}