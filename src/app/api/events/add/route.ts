import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventsLogic } from '@/app/api/events/EventsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const event = await EventsLogic.addEvent(data);

  if (!event) {
    return NextResponse.json('');
  }

  const responseData = baseTransformers.event(event);
  return NextResponse.json(responseData);
}
