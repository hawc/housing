import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventsLogic } from '@/app/api/events/EventsLogic';

export async function POST(req: NextRequest, props) {
  const { id } = await props.params;
  const data = await req.json();

  const event = await EventsLogic.updateEvent({ id }, data);

  if (!event) {
    return NextResponse.json('');
  }

  const responseData = EventsLogic.toBaseEvent(event);
  return NextResponse.json(responseData);
}
