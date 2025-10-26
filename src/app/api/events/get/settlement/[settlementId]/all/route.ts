import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventsLogic } from '@/app/api/events/EventsLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest, props) {
  const { settlementId } = await props.params;

  const events = await EventsLogic.findEvents({ settlementId });
  
  if (!events) {
    return NextResponse.json([]);
  }

  const responseData = events.map(baseTransformers.event);
  return NextResponse.json(responseData);
}
