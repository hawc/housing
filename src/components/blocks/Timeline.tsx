


import { BuildingIcon, CircleDotDashedIcon, HomeIcon } from 'lucide-react';

import { Headline } from '@/components/Headline';

import { Event } from '@/pages/admin';

const IconComponent = ({ type, className }: { type: string, className: string }): JSX.Element => {
  switch (type) {
    case 'Planung': return <CircleDotDashedIcon className={className} />;
    case 'Fertigstellung': return <BuildingIcon className={className} />;
    default: return <HomeIcon className={className} />;
  }
}

function TimelineItem({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <li className="flex relative flex-col pb-3 last:pb-0">
      {children}
    </li>)
}

function TimelineIcon({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <span className="w-max relative z-[2] flex-shrink-0 rounded-full overflow-hidden bg-bg text-grey-light p-2">
      {children}
    </span>)
}

function TimelineHeader({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex items-center gap-4">
      {children}
    </div>)
}

function TimelineBody({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex gap-4">
      <span className="pointer-events-none invisible h-full flex-shrink-0" style={{ width: '40px' }}></span>
      <div>
        {children}
      </div>
    </div>)
}

function TimelineWrapper({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <ul className="w-full flex flex-col">
      {children}
    </ul>
  )
}

function TimelineConnector() {
  return (
    <span className="absolute left-0 grid justify-center bg-transparent transition-opacity duration-200" style={{ top: '40px', width: '40px', opacity: 1, height: 'calc(100% - 40px)' }}>
      <span className="w-0.5 h-full bg-highlight"></span>
    </span>
  )
}

export default function Timeline({ events }: { events: Event[] }) {
  return (
    <div className="w-[32rem]">
      <TimelineWrapper>
        {events.filter((event: Event) => event.eventDate !== null).sort((eventA: Event, eventB: Event) => new Date(eventB.eventDate ?? 0).getTime() - new Date(eventA.eventDate ?? 0).getTime()).map((event: Event, index: number) => (
          <TimelineItem key={index}>
            {index < events.length - 1 && (
              <TimelineConnector />
            )}
            <TimelineHeader>
              <TimelineIcon>
                <IconComponent className="h-4 w-4" type={event.type.name} />
              </TimelineIcon>
              <Headline type='h5'>
                <>{new Date(event.eventDate ?? 0).getFullYear()}: {event.name}</>
              </Headline>
            </TimelineHeader>
            <TimelineBody>
              {event.description}
            </TimelineBody>
          </TimelineItem>
        ))}
        {events.filter((event: Event) => event.eventDate === null).map((event: Event, index: number) => (
          <TimelineItem key={index}>
            <TimelineHeader>
              <TimelineIcon>
                <IconComponent className="h-4 w-4" type={event.type.name} />
              </TimelineIcon>
              <Headline type='h5'>
                {event.name}
              </Headline>
            </TimelineHeader>
            <TimelineBody>
              {event.description}
            </TimelineBody>
          </TimelineItem>
        ))}
      </TimelineWrapper>
    </div >
  );
}