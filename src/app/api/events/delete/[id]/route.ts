import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EventsLogic } from '@/app/api/events/EventsLogic';

export async function GET(_req: NextRequest, props) {
  const { id } = await props.params;

  await EventsLogic.deleteEvent({ id });

  return NextResponse.json('');
}
