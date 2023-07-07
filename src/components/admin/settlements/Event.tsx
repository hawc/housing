import { BuildingIcon, CircleDotDashedIcon, HomeIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
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
    <span className="w-max relative z-[2] flex-shrink-0 rounded-full overflow-hidden bg-bg text-grey-light p-2 self-start">
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
      <div className='grow'>
        {children}
      </div>
    </div>)
}

function TimelineConnector() {
  return (
    <span className="absolute left-0 grid justify-center bg-transparent" style={{ top: '45px', width: '40px', height: 'calc(100% - 50px)' }}>
      <span className="w-0.5 h-full bg-highlight rounded-sm"></span>
    </span>
  )
}

export function Event({ event, hasConnector = false }: { event: Event, hasConnector?: boolean, }) {
  const [currentEvent, setCurrentEvent] = useState<Event>(event);
  const [loading, setLoading] = useState<boolean>(false);

  const updateEvent = (input: Partial<Event>) => {
    setCurrentEvent({
      ...event,
      ...input,
    } as Event)
  }

  function setEventName(eventName) {
    updateEvent({
      name: eventName
    });
  }

  function setEventDate(eventDate) {
    updateEvent({
      eventDate: new Date(new Date(eventDate).toUTCString()).toISOString()
    });
  }

  const submitData = async () => {
    setLoading(true);
    await callAPI({
      type: 'updateEvent',
      payload: {
        data: {
          name: currentEvent.name,
          description: currentEvent.description,
          eventDate: new Date(currentEvent.eventDate).toISOString(),
        },
        where: { id: currentEvent.id }
      }
    });
    setCurrentEvent(await callAPI({ type: 'getEvent', payload: { where: { id: currentEvent.id } } }));
    setLoading(false);
  }

  return (
    <>
      <TimelineItem>
        {hasConnector && (
          <TimelineConnector />
        )}
        <TimelineHeader>
          <TimelineIcon>
            <IconComponent className="h-4 w-4" type={event.type.name} />
          </TimelineIcon>
          <Headline type='h5'>
            <><InputGhost
              className='inline-block w-auto'
              type="date"
              value={event.eventDate}
              onChange={(e) => setEventDate(e.target.value)} />: <InputGhost
                className='block w-full'
                value={event.name}
                onChange={(e) => setEventName(e.target.value)} /></>
          </Headline>
        </TimelineHeader>
        <TimelineBody>
          <TextareaGhost value={event.description} onChange={(e) => event.description = e.target.value} />
          <Button onClick={submitData} disabled={loading}><>Änderungen speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</></Button>
        </TimelineBody>
      </TimelineItem>
    </>
  );
}