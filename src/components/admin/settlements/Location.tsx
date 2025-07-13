'use client';

import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { fetchData } from '@/lib/fetch';
import type { Location } from '@/lib/types';
import { getUniqueLabel } from '@/lib/utils';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';

async function updateLocation(id: string, data: Partial<Location>) {
  return await fetchData<Location>(`/api/locations/update/${id}`, undefined, { method: 'POST', body: JSON.stringify(data) });
}

async function addLocation(data: Partial<Location>) {
  return await fetchData<Location>('/api/locations/add', undefined, { method: 'POST', body: JSON.stringify(data) });
}

interface LocationProps {
  locationInput: Location | undefined;
  settlementId: string | undefined;
  onUpdate: () => unknown;
  className?: string
}

export function Location({ locationInput, settlementId, onUpdate, className = '' }: LocationProps) {
  const [location, setLocation] = useState<Partial<Location> | undefined>(locationInput);
  const [loading, setLoading] = useState<boolean>(false);
  const [uuid] = useState<string>(uuidv4());

  async function submitLocation(location: Partial<Location>) {
    setLoading(true);
    let responseLocation;
    if (location?.id) {
      const data = {
        lat: location.lat,
        lng: location.lng,
        name: location.name,
        address: location.address,
        district: location.district,
        zipCode: location.zipCode,
        city: location.city,
        state: location.state,
        geo: location.geo
      };
      responseLocation = await updateLocation(location.id, data);
    } else {
      const data = {
        lat: location.lat,
        lng: location.lng,
        name: location.name,
        address: location.address,
        district: location.district,
        zipCode: location.zipCode,
        city: location.city,
        state: location.state,
        geo: location.geo,
        settlement: {
          connect: {
            id: settlementId
          }
        }
      };
      responseLocation = await addLocation(data);
    }
    setLoading(false);
    if (responseLocation?.id) {
      setLocation(responseLocation);
      await onUpdate();
    }
  }

  async function updateLocationData(input: Partial<Location>) {
    setLocation({
      ...location,
      ...input,
    });
  }

  return (
    <div className={`columns-2 ${className}`}>
      <div>
        <label htmlFor={getUniqueLabel('lat', uuid)}>Lat:</label>
        <InputGhost value={location?.lat ?? ''} step="0.01" disabled={loading} type='number' id={getUniqueLabel('lat', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ lat: Number(event.target.value) })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('lng', uuid)}>Lng:</label>
        <InputGhost value={location?.lng ?? ''} step="0.01" disabled={loading} type='number' id={getUniqueLabel('lng', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ lng: Number(event.target.value) })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('geo', uuid)}>Geometriedaten (JSON):</label>
        <TextareaGhost value={JSON.stringify(location?.geo) ?? ''} disabled={loading} id={getUniqueLabel('geo', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ geo: JSON.parse(event.target.value.replace(/\s+/g, '')) })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('name', uuid)}>Volle Adresse:</label>
        <InputGhost value={location?.name ?? ''} disabled={loading} id={getUniqueLabel('name', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ name: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('address', uuid)}>Straße:</label>
        <InputGhost value={location?.address ?? ''} disabled={loading} id={getUniqueLabel('address', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ address: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('district', uuid)}>Stadtteil:</label>
        <InputGhost value={location?.district ?? ''} disabled={loading} id={getUniqueLabel('district', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ district: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('zipCode', uuid)}>PLZ:</label>
        <InputGhost value={location?.zipCode ?? ''} disabled={loading} type='number' id={getUniqueLabel('zipCode', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ zipCode: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('city', uuid)}>Stadt:</label>
        <InputGhost value={location?.city ?? ''} disabled={loading} id={getUniqueLabel('city', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ city: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('state', uuid)}>Bundesland:</label>
        <InputGhost value={location?.state ?? ''} disabled={loading} id={getUniqueLabel('state', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocationData({ state: event.target.value })} />
      </div>
      <div className='pt-7'>
        <Button
          onClick={location ? () => submitLocation(location) : () => { return; }}
          className='w-full'
          disabled={loading || !location?.lat || !location?.lng}>
          Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
        </Button>
      </div>
    </div>
  );
}