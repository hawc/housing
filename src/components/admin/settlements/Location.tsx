'use client';

import { useCallback, useId, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Location } from '@/lib/types';

import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { TextareaGhost } from '@/components/common/form/Textarea';
import { getUniqueLabel } from '@/utils/getUniqueLabel';

async function updateLocation(id: string, data: Partial<Location>) {
  return await fetchData<Location>(`/api/locations/update/${id}`, undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function addLocation(data: Partial<Location>) {
  return await fetchData<Location>('/api/locations/add', undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

interface LocationProps {
  locationInput: Location | undefined;
  settlementId: string | undefined;
  onUpdate: () => unknown;
  className?: string;
}

export function Location({
  locationInput,
  settlementId,
  onUpdate,
  className = '',
}: LocationProps) {
  const [location, setLocation] = useState<Partial<Location> | undefined>(
    locationInput,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const id = useId();

  const submitLocation = useCallback(
    async (location: Partial<Location>) => {
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
          geo: location.geo,
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
              id: settlementId,
            },
          },
        };
        responseLocation = await addLocation(data);
      }
      setLoading(false);
      if (responseLocation?.id) {
        setLocation(responseLocation);
        await onUpdate();
      }
    },
    [onUpdate, settlementId],
  );

  function updateLocationData(input: Partial<Location>) {
    setLocation({
      ...location,
      ...input,
    });
  }

  const handleSubmitLocation = useCallback(() => {
    if (!location) {
      return;
    }

    submitLocation(location);
  }, [location, submitLocation]);

  return (
    <div className={`columns-2 ${className}`}>
      <div>
        <label htmlFor={getUniqueLabel('lat', id)}>Lat:</label>
        <InputGhost
          value={location?.lat ?? ''}
          step='0.01'
          disabled={loading}
          type='number'
          id={getUniqueLabel('lat', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({ lat: Number(event.target.value) })
          }
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('lng', id)}>Lng:</label>
        <InputGhost
          value={location?.lng ?? ''}
          step='0.01'
          disabled={loading}
          type='number'
          id={getUniqueLabel('lng', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({ lng: Number(event.target.value) })
          }
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('geo', id)}>
          Geometriedaten (JSON):
        </label>
        <TextareaGhost
          value={JSON.stringify(location?.geo) ?? ''}
          disabled={loading}
          id={getUniqueLabel('geo', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({
              geo: JSON.parse(event.target.value.replace(/\s+/g, '')),
            })
          }
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('name', id)}>Volle Adresse:</label>
        <InputGhost
          value={location?.name ?? ''}
          disabled={loading}
          id={getUniqueLabel('name', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) => updateLocationData({ name: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('address', id)}>Straße:</label>
        <InputGhost
          value={location?.address ?? ''}
          disabled={loading}
          id={getUniqueLabel('address', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({ address: event.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('district', id)}>Stadtteil:</label>
        <InputGhost
          value={location?.district ?? ''}
          disabled={loading}
          id={getUniqueLabel('district', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({ district: event.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('zipCode', id)}>PLZ:</label>
        <InputGhost
          value={location?.zipCode ?? ''}
          disabled={loading}
          type='number'
          id={getUniqueLabel('zipCode', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({ zipCode: event.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('city', id)}>Stadt:</label>
        <InputGhost
          value={location?.city ?? ''}
          disabled={loading}
          id={getUniqueLabel('city', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) => updateLocationData({ city: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor={getUniqueLabel('state', id)}>Bundesland:</label>
        <InputGhost
          value={location?.state ?? ''}
          disabled={loading}
          id={getUniqueLabel('state', id)}
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          onChange={(event) =>
            updateLocationData({ state: event.target.value })
          }
        />
      </div>
      <div className='pt-7'>
        <Button
          onClick={handleSubmitLocation}
          className='w-full'
          disabled={!location?.lat || !location?.lng}
          loading={loading}
        >
          Speichern
        </Button>
      </div>
    </div>
  );
}
