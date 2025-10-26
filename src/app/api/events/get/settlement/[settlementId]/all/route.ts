import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventsLogic } from '@/app/api/events/EventsLogic';

export async function GET(_req: NextRequest, props) {
  const { settlementId } = await props.params;

  const events = await EventsLogic.findEvents({ settlementId });

  if (!events) {
    return NextResponse.json([]);
  }

  const responseData = events.map(EventsLogic.toBaseEvent);
  return NextResponse.json(responseData);
}
