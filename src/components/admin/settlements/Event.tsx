'use client';

import { BuildingIcon, CircleDotDashedIcon, HomeIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';
import { TextareaGhost } from '@/components/blocks/form/Textarea';

import { Event, EventType } from '@/app/admin/page';

interface EditEventProps extends React.HTMLAttributes<HTMLElement> {
  eventInput: Event | undefined;
  availableEventTypes: EventType[];
  settlementId: string | null;
  onUpdate: (detailId: string | undefined) => void;
}

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
    <li className="flex relative flex-col">
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

export function Event({ eventInput, availableEventTypes, settlementId, onUpdate }: EditEventProps) {
  const [event, setCurrentEvent] = useState<Event | undefined>(eventInput);
  const [eventTypeId, setEventTypeId] = useState<string | undefined>(event?.eventType?.id ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const updateEvent = (input: Partial<Event>) => {
    setCurrentEvent({
      ...event,
      ...input,
    } as Event)
  }

  const deleteEvent = async (id: string) => {
    setLoading(true);
    const submitData = {
      type: 'updateEvent',
      payload: {
        data: {
          published: false
        },
        where: { id }
      }
    };
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentEvent(undefined);
    }
    onUpdate(id);
    setLoading(false);
  }

  const submitEvent = async (event: Event, id: string | undefined) => {
    setLoading(true);
    let submitData;
    if (id) {
      submitData = {
        type: 'updateEvent',
        payload: {
          data: {
            name: event.name,
            description: event.description,
            source: event.source,
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
            source: event.source,
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
    onUpdate(id);
    setLoading(false);
  }

  return (
    <>
      <TimelineItem>
        <TimelineHeader>
          <TimelineIcon>
            <IconComponent className="h-4 w-4" type={eventTypeId ? (availableEventTypes.find(type => type.id === eventTypeId)?.name || '') : ''} />
          </TimelineIcon>
          <div className='flex gap-4'>
            <div className='basis-full'>
              <label htmlFor="eventName">Name:</label>
              <InputGhost
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                value={event?.name ?? ''}
                id='eventName'
                onChange={(event) => updateEvent({ name: event.target.value })} />
            </div>
            <div className='basis-full'>
              <label htmlFor="eventType">Typ:</label>
              <Select<EventType>
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                value={event?.eventType?.id ?? ''}
                options={availableEventTypes}
                id='eventType'
                onChange={(event) => setEventTypeId(event.target.value)} />
            </div>
          </div>
        </TimelineHeader>
        <TimelineBody>
          <div className='flex gap-4'>
            <div className='basis-full'>
              <label htmlFor="eventDate">Datum:</label>
              <InputGhost
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                type='date'
                value={event?.eventDate}
                id='eventDate'
                onChange={(event) => updateEvent({ eventDate: dateIsValid(event.target.value) ? new Date(new Date(event.target.value).toUTCString()).toISOString() : undefined })} />
            </div>
            <div className='basis-full'>
              <label htmlFor="eventSource">Quelle:</label>
              <InputGhost
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                value={event?.source ?? ''}
                id='eventSource'
                onChange={(event) => updateEvent({ source: event.target.value })} />
            </div>
          </div>
          <div className='basis-full'>
            <label htmlFor="eventDescription">Beschreibung:</label>
            <TextareaGhost
              className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
              value={event?.description ?? ''}
              id='eventDescription'
              onChange={(event) => updateEvent({ description: event.target.value })} />
          </div>
          <div className='flex gap-4 flex-col lg:flex-row mt-2'>
            <Button
              className='w-full'
              onClick={() => event && submitEvent(event, event?.id)}
              disabled={loading || !(event?.name)}><>{event?.id ? 'Speichern' : 'Hinzufügen'}
                {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
            </Button>
            {event?.id && (
              <Button
                className='w-full bg-text text-bg border border-text'
                onClick={() => deleteEvent(event.id)}
                disabled={loading || !(event?.name)}><>Löschen
                  {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
              </Button>
            )}
          </div>
        </TimelineBody>
      </TimelineItem>
    </>
  );
}