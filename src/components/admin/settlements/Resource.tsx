'use client';

import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { callAPI } from '@/lib/api';
import { getUniqueLabel } from '@/lib/utils';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';
import Upload from '@/components/blocks/form/Upload';

import { Resource, ResourceType } from '@/app/admin/page';
import { ImageResponse } from '@/app/api/upload/route';

interface EditResourceProps extends React.HTMLAttributes<HTMLElement> {
  resourceInput: Resource | undefined;
  availableResourceTypes: ResourceType[];
  settlementId: string | null;
  settlementSlug: string;
  onUpdate: (resourceId: string | undefined) => void;
}

export function EditResource({ resourceInput, availableResourceTypes, settlementId, settlementSlug, onUpdate, ...rest }: EditResourceProps) {
  const [resource, setCurrentResource] = useState<Resource | undefined>(resourceInput);
  const [resourceType, setResourceType] = useState<ResourceType | undefined>(resource?.resourceType);
  const [loading, setLoading] = useState<boolean>(false);

  const uuid = uuidv4();

  const updateResource = (input: Partial<Resource>) => {
    setCurrentResource({
      ...resource,
      ...input,
    } as Resource)
  }

  const deleteResource = async (id: string) => {
    setLoading(true);
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

  const submitResource = async (resource: Resource, id: string) => {
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
            resourceTypeId: resourceType?.id,
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
            resourceTypeId: resourceType?.id,
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

  const imageUploadCallback = (images: ImageResponse[]) => {
    if (images.length !== 1) {
      updateResource({
        url: undefined
      });
      return;
    }
    const image = images[0];
    updateResource({
      url: image.url
    });
  }

  return (
    <div {...rest}>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceType', uuid)}>Typ:</label>
          <Select<ResourceType>
            id={getUniqueLabel('resourceType', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.resourceType?.id ?? ''}
            options={availableResourceTypes}
            onChange={(event) => setResourceType(availableResourceTypes.find(resourceType => resourceType.id === event.target.value))} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceName', uuid)}>Name:</label>
          <InputGhost
            id={getUniqueLabel('resourceName', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.name ?? ''}
            onChange={(event) => updateResource({ name: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceCopyright', uuid)}>Copyright:</label>
          <InputGhost
            id={getUniqueLabel('resourceCopyright', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.copyright ?? ''}
            onChange={(event) => updateResource({ copyright: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceSource', uuid)}>Quelle:</label>
          <InputGhost
            id={getUniqueLabel('resourceSource', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.source ?? ''}
            onChange={(event) => updateResource({ source: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceDescription', uuid)}>Beschreibung:</label>
          <InputGhost
            id={getUniqueLabel('resourceDescription', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.description ?? ''}
            onChange={(event) => updateResource({ description: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceLicense', uuid)}>Lizenz:</label>
          <InputGhost
            id={getUniqueLabel('resourceLicense', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.license ?? ''}
            onChange={(event) => updateResource({ license: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceUrl', uuid)}>URL:</label>
          <InputGhost
            key={resource?.url}
            id={getUniqueLabel('resourceUrl', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.url ?? ''}
            onChange={(event) => updateResource({ url: event.target.value })} />
        </div>
        {resourceType?.name === 'Foto' &&
          <div className='basis-full overflow-hidden'>
            <label htmlFor={getUniqueLabel('resourceImage', uuid)}>Foto:</label>
            <Upload
              className='mt-1 mb-2'
              id={getUniqueLabel('resourceImage', uuid)}
              onUpload={imageUploadCallback}
              category={settlementSlug} />
          </div>
        }
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2 mb-1'>
        <Button
          className='w-full'
          onClick={() => resource && submitResource(resource, resource?.id)}
          disabled={loading || !(resource?.name) || (resourceType?.name === 'Foto' && !resource.url)}><>{resource?.id ? 'Speichern' : 'Hinzufügen'}
            {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
        </Button>
        {resource?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteResource(resource.id)}
            disabled={loading || !(resource?.name)}><>Löschen
              {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
          </Button>
        )}
      </div>
    </div>
  );
}