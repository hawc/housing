'use client';

import { useEffect, useMemo, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Event, EventType } from '@/lib/types';

import { Event as EventComponent } from '@/components/admin/settlements/timeline/Event';
import { clsxm } from '@/lib/clsxm';
import { sortByDate } from '@/utils/sortByDate';

interface TimelineProps {
  eventsInput?: Event[];
  settlementId: string;
}

export function Timeline({ eventsInput, settlementId }: TimelineProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>(
    [],
  );
  const [events, setEvents] = useState<Event[] | undefined>(eventsInput);

  async function getAvailableEventTypes() {
    setLoading(true);
    const eventTypes = await fetchData<EventType[], EventType[]>(
      '/api/eventTypes/get/all',
      [],
    );
    setAvailableEventTypes(eventTypes);
    setLoading(false);
  }

  async function getEvents(settlementId: string) {
    setLoading(true);
    const events = await fetchData<Event[], Event[]>(
      `/api/events/get/settlement/${settlementId}/all`,
      [],
    );
    setEvents(events);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableEventTypes();
  }, []);

  const sortedEvents = useMemo(() => {
    if (!events) {
      return [];
    }

    return sortByDate(events, 'eventDate');
  }, [events]);

  return (
    <ul
      className={clsxm(
        `w-full flex flex-col ${
          loading
            ? 'transition-filter pointer-events-none blur-sm'
            : 'transition-filter'
        }`,
      )}
    >
      {sortedEvents.map((event: Event) => (
        <div key={event.id}>
          <EventComponent
            settlementId={settlementId}
            availableEventTypes={availableEventTypes}
            eventInput={event}
            onUpdate={() => getEvents(settlementId)}
          />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EventComponent
        key={events?.length}
        settlementId={settlementId}
        availableEventTypes={availableEventTypes}
        eventInput={undefined}
        onUpdate={() => getEvents(settlementId)}
      />
    </ul>
  );
}
