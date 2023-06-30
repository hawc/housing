
import {
  Timeline as TailwindTimeline,
  TimelineBody,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  Typography,
} from '@material-tailwind/react';
import { BuildingIcon, CircleDotDashedIcon, HomeIcon } from 'lucide-react';

import { Event } from '@/pages/admin';

const IconComponent = ({ type, className }: { type: string, className: string }): JSX.Element => {
  switch (type) {
    case 'Planung': return <CircleDotDashedIcon className={className} />;
    case 'Fertigstellung': return <BuildingIcon className={className} />;
    default: return <HomeIcon className={className} />;
  }
}

export default function Timeline({ events }: { events: Event[] }) {
  return (
    <div className="w-[32rem]">
      <TailwindTimeline>
        {events.filter((event: Event) => event.eventDate !== null).sort((eventA: Event, eventB: Event) => new Date(eventB.eventDate ?? 0).getTime() - new Date(eventA.eventDate ?? 0).getTime()).map((event: Event, index: number) => (
          <TimelineItem key={index}>
            {index < events.length - 1 && (
              <TimelineConnector />
            )}
            <TimelineHeader>
              <TimelineIcon className="p-2">
                <IconComponent className="h-4 w-4" type={event.type.name} />
              </TimelineIcon>
              <Typography variant="h5" color="blue-gray">
                {new Date(event.eventDate ?? 0).getFullYear()}: {event.name}
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography color="gary" className="font-normal text-gray-600">
                {event.description}
              </Typography>
            </TimelineBody>
          </TimelineItem>
        ))}
        {events.filter((event: Event) => event.eventDate === null).map((event: Event, index: number) => (
          <TimelineItem key={index}>
            <TimelineHeader>
              <TimelineIcon className="p-2">
                <IconComponent className="h-4 w-4" type={event.type.name} />
              </TimelineIcon>
              <Typography variant="h5" color="blue-gray">
                {event.name}
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography color="gary" className="font-normal text-gray-600">
                {event.description}
              </Typography>
            </TimelineBody>
          </TimelineItem>
        ))}
      </TailwindTimeline>
    </div >
  );
}