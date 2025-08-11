'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { fetchData } from '@/lib/fetch';
import type { Event, EventType } from '@/lib/types';

import { Event as EventComponent } from '@/components/admin/settlements/Event';
import { sortByDate } from '@/utils/sortByDate';

interface TimelineWrapperProps {
  className?: string;
}

function TimelineWrapper({ children, className = '' }: PropsWithChildren<TimelineWrapperProps>) {
  return (
    <ul className={twMerge(`w-full flex flex-col ${className}`)}>
      {children}
    </ul>
  );
}

interface TimelineProps { 
  eventsInput: Event[];
  settlementId: string;
}

export function Timeline({ eventsInput, settlementId }: TimelineProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>([]);
  const [events, setEvents] = useState<Event[]>(eventsInput);

  async function getAvailableEventTypes() {
    setLoading(true);
    const eventTypes = await fetchData<EventType[], EventType[]>('/api/eventTypes/get/all', []);
    setAvailableEventTypes(eventTypes);
    setLoading(false);
  }

  async function getEvents(settlementId: string) {
    setLoading(true);
    const events = await fetchData<Event[], Event[]>(`/api/events/get/settlement/${settlementId}/all`, []);
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