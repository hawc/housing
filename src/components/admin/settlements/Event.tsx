import { BuildingIcon, CircleDotDashedIcon, HomeIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';
import { TextareaGhost } from '@/components/blocks/form/Textarea';

import { Event, EventType } from '@/pages/admin';

export function dateIsValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

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

export function Event({ eventInput, availableEventTypes, settlementId, hasConnector = false }: { eventInput: Event | undefined, availableEventTypes: EventType[], settlementId: string | null, hasConnector?: boolean, }) {
  const [event, setCurrentEvent] = useState<Event | undefined>(eventInput);
  const [eventTypeId, setEventTypeId] = useState<string | undefined>(event?.eventType?.id ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const updateEvent = (input: Partial<Event>) => {
    setCurrentEvent({
      ...event,
      ...input,
    } as Event)
  }

  const submitEvent = async () => {
    setLoading(true);
    let submitData;
    if (event?.id) {
      submitData = {
        type: 'updateEvent',
        payload: {
          data: {
            name: event.name,
            description: event.description,
            eventDate: event.eventDate ? new Date(event.eventDate) : null,
            eventTypeId: eventTypeId,
          },
          where: { id: event.id }
        }
      };
    } else {
      submitData = {
        type: 'addEvent',
        payload: {
          data: {
            name: event.name,
            description: event.description,
            eventDate: event.eventDate ? new Date(event.eventDate) : null,
            eventTypeId: eventTypeId,
            settlementId: settlementId,
          },
        }
      };
    }
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentEvent(response);
    }
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
            <IconComponent className="h-4 w-4" type={eventTypeId ? availableEventTypes.find(type => type.id === eventTypeId)?.name : ''} />
          </TimelineIcon>
          <div className='flex w-full'>
            <InputGhost
              className='border-highlight border-2 border-solid mb-2 p-1'
              type='date'
              value={event?.eventDate ?? new Date().toDateString()}
              onChange={(event) => updateEvent({ eventDate: dateIsValid(event.target.value) ? new Date(new Date(event.target.value).toUTCString()).toISOString() : null })} />:
            <InputGhost
              className='border-highlight border-2 border-solid mb-2 p-1'
              value={event?.name ?? ''}
              onChange={(event) => updateEvent({ name: event.target.value })} />
          </div>
        </TimelineHeader>
        <TimelineBody>
          <Select<EventType>
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={event?.eventType?.id ?? ''}
            options={availableEventTypes}
            onChange={(event) => setEventTypeId(event.target.value)} />
          <TextareaGhost className='border-highlight border-2 border-solid' value={event?.description ?? ''} onChange={(event) => updateEvent({ description: event.target.value })} />
          <Button onClick={submitEvent} disabled={loading || !(event?.name)}><>Änderungen speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</></Button>
        </TimelineBody>
      </TimelineItem>
    </>
  );
}