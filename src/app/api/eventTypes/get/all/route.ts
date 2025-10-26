import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventTypesLogic } from '@/app/api/eventTypes/EventTypesLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest) {
  const eventTypes = await EventTypesLogic.findEventTypes();
  
  if (!eventTypes.length) {
    return NextResponse.json([]);
  }

  const responseData = eventTypes.map(baseTransformers.eventType);
  return NextResponse.json(responseData);
}
