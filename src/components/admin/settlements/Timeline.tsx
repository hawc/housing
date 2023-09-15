'use client';

import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { sortByDate } from '@/lib/utils';

import { Event as EventComponent } from '@/components/admin/settlements/Event';

import { Event, EventType } from '@/app/admin/page';


function TimelineWrapper({ children, className = '' }: React.HTMLAttributes<HTMLElement>) {
  return (
    <ul className={twMerge(`w-full flex flex-col ${className}`)}>
      {children}
    </ul>
  )
}

export function Timeline({ eventsInput, settlementId }: { eventsInput: Event[], settlementId: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>([]);
  const [events, setEvents] = useState<Event[]>(eventsInput);

  async function getAvailableEventTypes() {
    setLoading(true);
    // const response = await fetch(`${process.env.BASE_URL ?? ''}/api/eventTypes/get/all`);
    // const eventTypes = await response.json();
    const eventTypes = [];
    setAvailableEventTypes(eventTypes);
    setLoading(false);
  }

  async function getEvents(settlementId: string) {
    setLoading(true);
    const response = await fetch(`${process.env.BASE_URL ?? ''}/api/events/get/${settlementId}/all`);
    const events = await response.json();
    setEvents(events);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableEventTypes();
  }, []);

  return (
    <TimelineWrapper className={loading ? 'transition-filter pointer-events-none blur-sm' : 'transition-filter'}>
      {events && sortByDate(events, 'eventDate').map((event: Event) => (
        <div key={event.id}>
          <EventComponent
            settlementId={settlementId}
            availableEventTypes={availableEventTypes}
            eventInput={event}
            onUpdate={() => getEvents(settlementId)} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EventComponent
        key={events?.length}
        settlementId={settlementId}
        availableEventTypes={availableEventTypes}
        eventInput={undefined}
        onUpdate={() => getEvents(settlementId)} />
    </TimelineWrapper>
  );
}