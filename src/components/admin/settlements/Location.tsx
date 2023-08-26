'use client';

import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { callAPI } from '@/lib/api';
import { getUniqueLabel } from '@/lib/utils';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';

import { Location } from '@/app/admin/page';

export function Location({ locationInput, settlementId, onUpdate, className = '' }: { locationInput: Location | undefined, settlementId: string | undefined, onUpdate: () => any; className?: string }) {
  const [location, setLocation] = useState<Partial<Location> | undefined>(locationInput);
  const [loading, setLoading] = useState<boolean>(false);

  const uuid = uuidv4();

  const submitLocation = async () => {
    setLoading(true);
    let submitData;
    if (location?.id) {
      submitData = {
        type: 'updateLocation',
        payload: {
          where: {
            id: location.id
          },
          data: {
            lat: location.lat,
            lng: location.lng,
            name: location.name,
            address: location.address,
            district: location.district,
            zipCode: location.zipCode,
            city: location.city,
          }
        }
      };
    } else {
      submitData = {
        type: 'addLocation',
        payload: {
          data: {
            lat: location?.lat ?? undefined,
            lng: location?.lng ?? undefined,
            name: location?.name ?? undefined,
            address: location?.address ?? undefined,
            district: location?.district ?? undefined,
            zipCode: location?.zipCode ?? undefined,
            city: location?.city ?? undefined,
            settlementId: settlementId
          }
        }
      };
    }
    const locationResponse = await callAPI(submitData);
    setLoading(false);
    if (locationResponse?.id) {
      setLocation(locationResponse);
      await onUpdate();
    }
  }

  const updateLocation = async (input: Partial<Location>) => {
    setLocation({
      ...location,
      ...input,
    });
  }

  return (
    <div className={`columns-2 ${className}`}>
      <div>
        <label htmlFor={getUniqueLabel('lat', uuid)}>Lat:</label>
        <InputGhost value={location?.lat ?? ''} step="0.01" disabled={loading} type='number' id={getUniqueLabel('lat', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ lat: Number(event.target.value) })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('lng', uuid)}>Lng:</label>
        <InputGhost value={location?.lng ?? ''} step="0.01" disabled={loading} type='number' id={getUniqueLabel('lng', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ lng: Number(event.target.value) })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('name', uuid)}>Volle Adresse:</label>
        <InputGhost value={location?.name ?? ''} disabled={loading} id={getUniqueLabel('name', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ name: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('address', uuid)}>Straße:</label>
        <InputGhost value={location?.address ?? ''} disabled={loading} id={getUniqueLabel('address', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ address: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('district', uuid)}>Stadtteil:</label>
        <InputGhost value={location?.district ?? ''} disabled={loading} id={getUniqueLabel('district', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ district: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('zipCode', uuid)}>PLZ:</label>
        <InputGhost value={location?.zipCode ?? ''} disabled={loading} type='number' id={getUniqueLabel('zipCode', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ zipCode: event.target.value })} />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('city', uuid)}>Stadt:</label>
        <InputGhost value={location?.city ?? ''} disabled={loading} id={getUniqueLabel('city', uuid)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' onChange={(event) => updateLocation({ city: event.target.value })} />
      </div>
      <div className='pt-7'>
        <Button
          onClick={submitLocation}
          className='w-full'
          disabled={loading || !location?.lat || !location?.lng}>
          <>Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
        </Button>
      </div>
    </div>
  );
}