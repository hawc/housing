import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';

import { Resource, ResourceType } from '@/pages/admin';

interface EditResourceProps extends React.HTMLAttributes<HTMLElement> {
  resourceInput: Resource | undefined;
  availableResourceTypes: ResourceType[];
  settlementId: string | null;
  onUpdate: (resourceId: string | undefined) => void;
}

export function EditResource({ resourceInput, availableResourceTypes, settlementId, onUpdate, ...rest }: EditResourceProps) {
  const [resource, setCurrentResource] = useState<Resource | undefined>(resourceInput);
  const [resourceTypeId, setResourceTypeId] = useState<string | undefined>(resource?.resourceType?.id ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const updateResource = (input: Partial<Resource>) => {
    setCurrentResource({
      ...resource,
      ...input,
    } as Resource)
  }

  const deleteResource = async (id) => {
    const submitData = {
      type: 'updateResource',
      payload: {
        data: {
          published: false
        },
        where: { id }
      }
    };
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentResource(undefined);
    }
    onUpdate(id);
    setLoading(false);
  }

  const submitResource = async (id) => {
    setLoading(true);
    let submitData;
    if (id) {
      submitData = {
        type: 'updateResource',
        payload: {
          data: {
            name: resource.name,
            description: resource.description,
            source: resource.source,
            url: resource.url,
            license: resource.license,
            copyright: resource.copyright,
            resourceTypeId: resourceTypeId,
          },
          where: { id }
        }
      };
    } else {
      submitData = {
        type: 'addResource',
        payload: {
          data: {
            name: resource.name,
            description: resource.description,
            source: resource.source,
            url: resource.url,
            license: resource.license,
            copyright: resource.copyright,
            resourceTypeId: resourceTypeId,
            settlementId: settlementId,
          },
        }
      };
    }
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentResource(response);
    }
    onUpdate(id);
    setLoading(false);
  }

  return (
    <div {...rest}>
      <div>
        <label htmlFor="resourceName">Name:</label>
        <InputGhost
          id='resourceName'
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          value={resource?.name ?? ''}
          onChange={(event) => updateResource({ name: event.target.value })} />
      </div>
      <div>
        <label htmlFor="resourceSource">Quelle:</label>
        <InputGhost
          id='resourceSource'
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          value={resource?.source ?? ''}
          onChange={(event) => updateResource({ source: event.target.value })} />
      </div>
      <div>
        <label htmlFor="resourceType">Typ:</label>
        <Select<ResourceType>
          id='resourceType'
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          value={resource?.resourceType?.id ?? ''}
          options={availableResourceTypes}
          onChange={(resource) => setResourceTypeId(resource.target.value)} />
      </div>
      <div>
        <label htmlFor="resourceDescription">Beschreibung:</label>
        <InputGhost
          id='resourceDescription'
          className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
          value={resource?.description ?? ''}
          onChange={(event) => updateResource({ description: event.target.value })} />
      </div>
      <div className='flex gap-4'>
        <Button
          className='w-full'
          onClick={() => submitResource(resource?.id)}
          disabled={loading || !(resource?.name)}><>Änderungen speichern
            {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
        </Button>
        {resource?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteResource(resource.id)}
            disabled={loading || !(resource?.name)}><>Resource löschen
              {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
          </Button>
        )}
      </div>
    </div>
  );
}