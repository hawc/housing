
import { Event as EventComponent } from '@/components/admin/settlements/Event';

import { Event } from '@/pages/admin';


function TimelineWrapper({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <ul className="w-full flex flex-col">
      {children}
    </ul>
  )
}

function sortDates(dateA = '0', dateB = '0') {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
}

export function Timeline({ events }: { events: Event[] }) {
  return (
    <TimelineWrapper>
      {events.filter((event: Event) => event.eventDate !== null).sort((eventA: Event, eventB: Event) => sortDates(eventA.eventDate, eventB.eventDate)).map((event: Event, index: number) => (
        <EventComponent key={event.id} event={event} hasConnector={index < events.length - 1} />
      ))}
      {events.filter((event: Event) => event.eventDate === null).map((event: Event) => (
        <EventComponent key={event.id} event={event} />
      ))}
    </TimelineWrapper>
  );
}