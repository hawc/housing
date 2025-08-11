'use client';

import type { Prisma } from '@prisma/client';
import { Loader2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { fetchData } from '@/lib/fetch';
import type { Event, EventType } from '@/lib/types';

import { TimelineIcon } from '@/components/admin/settlements/timeline/Icon';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { getUniqueLabel } from '@/utils/getUniqueLabel';
import { isDateValid } from '@/utils/isDateValid';

interface EditEventProps {
  eventInput: Event | undefined;
  availableEventTypes: EventType[];
  settlementId: string;
  onUpdate: (detailId: string | undefined) => void;
}

export function Event({ eventInput, availableEventTypes, settlementId, onUpdate }: EditEventProps) {
  const [event, setCurrentEvent] = useState<Event | undefined>(eventInput);
  const [eventTypeId, setEventTypeId] = useState<string>(event?.eventType?.id ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [uuid] = useState<string>(uuidv4());

  const eventTypeName = availableEventTypes.find(type => type.id === eventTypeId)?.name;

  function setEvent(input: Partial<Event>) {
    setCurrentEvent({
      ...event,
      ...input,
    } as Event);
  }

  async function deleteEvent(id: string) {
    setLoading(true);
    await fetchData(`/api/events/delete/${id}`);
    setCurrentEvent(undefined); // todo: check if deletion is successful
    onUpdate(id);
    setLoading(false);
  }

  async function updateEvent(id: string, data: Prisma.EventsUncheckedUpdateInput) {
    return await fetchData<Event>(`/api/events/update/${id}`, undefined, { method: 'POST', body: JSON.stringify(data) });
  }

  async function addEvent(data: Prisma.EventsUncheckedCreateInput) {
    return await fetchData<Event>('/api/events/add', undefined, { method: 'POST', body: JSON.stringify(data) });
  }

  async function submitData(event, eventTypeId: string, settlementId: string) {
    setLoading(true);
    let response: Event | undefined;
    if (event?.id) {
      const data: Prisma.EventsUncheckedUpdateInput = {
        name: event.name,
        description: event.description,
        source: event.source,
        eventDate: event.eventDate ? new Date(event.eventDate) : null,
        eventTypeId: eventTypeId,
      };
      response = await updateEvent(event.id, data);
    } else {
      const data: Prisma.EventsUncheckedCreateInput = {
        name: event.name || eventTypeName,
        description: event.description,
        source: event.source,
        eventDate: event.eventDate ? new Date(event.eventDate) : null,
        eventTypeId: eventTypeId,
        settlementId: settlementId,
      };
      response = await addEvent(data);
    }
    if (response) {
      setCurrentEvent(response);
      onUpdate(response.id);
    }
    setLoading(false);
  }

  const eventIconType = useMemo(() => {
    if (!eventTypeId) {
      return '';
    }

    return availableEventTypes.find(type => type.id === eventTypeId)?.name || '';
  }, [availableEventTypes, eventTypeId]);

  return (
    <li className='flex relative flex-col'>
      <div className='flex items-center gap-4'>
        <TimelineIcon type={eventIconType} />
        <div className='flex gap-4'>
          <div className='basis-full'>
            <label htmlFor={getUniqueLabel('eventType', uuid)}>Typ:</label>
            <Select<EventType>
              className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
              value={event?.eventType?.id ?? ''}
              options={availableEventTypes}
              id={getUniqueLabel('eventType', uuid)}
              onChange={(event) => setEventTypeId(event.target.value)} />
          </div>
          <div className='basis-full'>
            <label htmlFor={getUniqueLabel('eventName', uuid)}>Name:</label>
            <InputGhost
              id={getUniqueLabel('eventName', uuid)}
              placeholder={eventTypeName}
              className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
              value={event?.name ?? ''}
              onChange={(event) => setEvent({ name: event.target.value })} />
          </div>
        </div>
      </div>
      <div className='flex gap-4'>
        <span className='pointer-events-none invisible h-full flex-shrink-0' style={{ width: '40px' }}></span>
        <div className='grow'>
          <div className='flex gap-4'>
            <div className='basis-full'>
              <label htmlFor={getUniqueLabel('eventDate', uuid)}>Datum:</label>
              <InputGhost
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                type='date'
                value={event?.eventDate}
                id={getUniqueLabel('eventDate', uuid)}
                onChange={(event) => setEvent({ eventDate: isDateValid(event.target.value) ? new Date(new Date(event.target.value).toUTCString()).toISOString() : undefined })} />
            </div>
            <div className='basis-full'>
              <label htmlFor={getUniqueLabel('eventSource', uuid)}>Quelle:</label>
              <InputGhost
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                value={event?.source ?? ''}
                id={getUniqueLabel('eventSource', uuid)}
                onChange={(event) => setEvent({ source: event.target.value })} />
            </div>
          </div>
          <div className='basis-full'>
            <label htmlFor={getUniqueLabel('eventDescription', uuid)}>Beschreibung:</label>
            <TextareaGhost
              className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
              value={event?.description ?? ''}
              id={getUniqueLabel('eventDescription', uuid)}
              onChange={(event) => setEvent({ description: event.target.value })} />
          </div>
          <div className='flex gap-4 flex-col lg:flex-row mt-2'>
            <Button
              className='w-full'
              onClick={event ? () => submitData(event, eventTypeId, settlementId) : () => { return; }}
              disabled={loading || (!event?.name && !eventTypeName)}><>{event?.id ? 'Speichern' : 'Hinzufügen'}
                {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
            </Button>
            {event?.id && (
              <Button
                className='w-full bg-text text-bg border border-text'
                onClick={() => deleteEvent(event.id)}
                disabled={loading || (!event?.name && !eventTypeName)}><>Löschen
                  {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}