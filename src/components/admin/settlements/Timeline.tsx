
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { callAPI } from '@/lib/api';
import { sortByDate } from '@/lib/utils';

import { Event as EventComponent } from '@/components/admin/settlements/Event';

import { Event, EventType } from '@/pages/admin';


function TimelineWrapper({ children, className = '' }: React.HTMLAttributes<HTMLElement>) {
  return (
    <ul className={twMerge(`w-full flex flex-col ${className}`)}>
      {children}
    </ul>
  )
}

export function Timeline({ eventsInput, settlementId }: { eventsInput: Event[], settlementId: string | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>([]);
  const [events, setEvents] = useState<Event[]>(eventsInput);

  const getAvailableEventTypes = async () => {
    setLoading(true);
    const eventTypes = (await callAPI({ type: 'getEventTypes' }));
    setAvailableEventTypes(eventTypes);
    setLoading(false);
  }

  const getEvents = async () => {
    setLoading(true);
    const events = (await callAPI({ type: 'getEvents', payload: { where: { settlementId } } }));
    setEvents(events);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableEventTypes();
  }, []);

  return (
    <TimelineWrapper className={loading ? 'transition-filter pointer-events-none blur-sm' : 'transition-filter'}>
      {events && sortByDate(events).map((event: Event) => (
        <div key={event.id}>
          <EventComponent
            settlementId={settlementId}
            availableEventTypes={availableEventTypes}
            eventInput={event}
            onUpdate={getEvents} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EventComponent
        key={events?.length}
        settlementId={settlementId}
        availableEventTypes={availableEventTypes}
        eventInput={undefined}
        onUpdate={getEvents} />
    </TimelineWrapper>
  );
}