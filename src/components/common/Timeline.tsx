import { BuildingIcon, CircleDotDashedIcon, HomeIcon } from 'lucide-react';

import type { Event } from '@/lib/types';

import { Link } from '@/components/common/Link';
import { Tooltip } from '@/components/common/Tooltip';
import { Headline } from '@/components/Headline';
import { isDateValid } from '@/utils/isDateValid';
import { sortByDate } from '@/utils/sortByDate';
import { PropsWithChildren, useMemo } from 'react';

interface IconComponentProps {
  type: string;
  className: string;
}

function IconComponent({ type, className }: IconComponentProps) {
  switch (type) {
    case 'Planung':
      return <CircleDotDashedIcon className={className} />;
    case 'Fertigstellung':
      return <BuildingIcon className={className} />;
    default:
      return <HomeIcon className={className} />;
  }
}

function TimelineItem({ children }: PropsWithChildren) {
  return <li className='flex relative flex-col pb-3 last:pb-0'>{children}</li>;
}

function TimelineIcon({ children }: PropsWithChildren) {
  return (
    <span className='w-max relative z-[2] flex-shrink-0 rounded-full overflow-hidden bg-bg text-grey-light p-2 self-start'>
      {children}
    </span>
  );
}

function TimelineHeader({ children }: PropsWithChildren) {
  return <div className='flex items-center gap-4'>{children}</div>;
}

function TimelineBody({ children }: PropsWithChildren) {
  return (
    <div className='flex gap-4'>
      <span
        className='pointer-events-none invisible h-full flex-shrink-0'
        style={{ width: '40px' }}
      ></span>
      <div className='flex flex-col gap-2'>{children}</div>
    </div>
  );
}

function TimelineWrapper({ children }: PropsWithChildren) {
  return <ul className='w-full flex flex-col'>{children}</ul>;
}

function TimelineConnector() {
  return (
    <span
      className='absolute left-0 grid justify-center bg-transparent'
      style={{ top: '45px', width: '40px', height: 'calc(100% - 50px)' }}
    >
      <span className='w-0.5 h-full bg-highlight rounded-sm'></span>
    </span>
  );
}

interface TimelineProps {
  events: Event[];
}

export function Timeline({ events }: TimelineProps) {
  const filteredEvents = useMemo(() => {
    return sortByDate(events, 'eventDate').filter((event) =>
      isDateValid(event.eventDate),
    );
  }, [events]);

  return (
    <TimelineWrapper>
      {filteredEvents.map((event: Event, index: number) => (
        <TimelineItem key={index}>
          {index < events.length - 1 && <TimelineConnector />}
          <TimelineHeader>
            <TimelineIcon>
              <IconComponent className='h-4 w-4' type={event.eventType.name} />
            </TimelineIcon>
            <Headline type='h5'>
              {new Date(event.eventDate ?? 0).getFullYear()}: {event.name}
            </Headline>
          </TimelineHeader>
          <TimelineBody>
            <div>{event.description}</div>
            {event.source && (
              <div>
                {event.source.includes('http') ? (
                  <Link href={event.source} title={event.source}>
                    Quelle
                  </Link>
                ) : (
                  <Tooltip text={event.source}>Quelle</Tooltip>
                )}
              </div>
            )}
          </TimelineBody>
        </TimelineItem>
      ))}
      {events
        .filter((event: Event) => event.eventDate === null)
        .map((event: Event, index: number) => (
          <TimelineItem key={index}>
            <TimelineHeader>
              <TimelineIcon>
                <IconComponent
                  className='h-4 w-4'
                  type={event.eventType.name}
                />
              </TimelineIcon>
              <Headline type='h5'>{event.name}</Headline>
            </TimelineHeader>
            <TimelineBody>{event.description}</TimelineBody>
          </TimelineItem>
        ))}
    </TimelineWrapper>
  );
}
