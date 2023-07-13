
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { callAPI } from '@/lib/api';

import { Event as EventComponent } from '@/components/admin/settlements/Event';

import { Event, EventType } from '@/pages/admin';


function TimelineWrapper({ children, className = '' }: React.HTMLAttributes<HTMLElement>) {
  return (
    <ul className={twMerge(`w-full flex flex-col ${className}`)}>
      {children}
    </ul>
  )
}

function sortDates(dateA = '0', dateB = '0') {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
}

export function Timeline({ events, settlementId }: { events: Event[], settlementId: string | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>([]);

  const getAvailableEventTypes = async () => {
    setLoading(true);
    const eventTypes = (await callAPI({ type: 'getEventTypes' }));
    setAvailableEventTypes(eventTypes);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableEventTypes();
  }, []);

  return (
    <TimelineWrapper className={loading ? 'transition-filter pointer-events-none blur-sm' : 'transition-filter'}>
      {events.filter((event: Event) => event.eventDate !== null).sort((eventA: Event, eventB: Event) => sortDates(eventA.eventDate, eventB.eventDate)).map((event: Event, index: number) => (
        <EventComponent settlementId={settlementId} availableEventTypes={availableEventTypes} key={event.id} eventInput={event} hasConnector={index < events.length - 1} />
      ))}
      {events.filter((event: Event) => event.eventDate === null).map((event: Event) => (
        <EventComponent settlementId={settlementId} availableEventTypes={availableEventTypes} key={event.id} eventInput={event} />
      ))}
      <EventComponent settlementId={settlementId} availableEventTypes={availableEventTypes} eventInput={undefined} />
    </TimelineWrapper>
  );
}