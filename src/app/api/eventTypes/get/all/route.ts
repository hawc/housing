import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventTypesLogic } from '@/app/api/eventTypes/EventTypesLogic';

export async function GET(_req: NextRequest) {
  const eventTypes = await EventTypesLogic.findEventTypes();

  if (!eventTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = eventTypes.map(EventTypesLogic.toBaseEventType);
  return NextResponse.json(responseData);
}
