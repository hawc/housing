'use client';

import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { fetchData } from '@/lib/fetch';
import type { Resource, ResourceType } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';
import Upload from '@/components/blocks/form/Upload';

import type { ImageResponse } from '@/app/api/upload/route';
import { LightBox } from '@/components/blocks/LightBox';
import { getUniqueLabel } from '@/utils/getUniqueLabel';

interface EditResourceProps {
  resourceInput: Resource | undefined;
  availableResourceTypes: ResourceType[];
  settlementId: string;
  settlementSlug: string;
  className?: string;
  onUpdate: (resourceId: string | undefined) => void;
}

async function updateResource(id: string, data: unknown) {
  return await fetchData<Resource>(`/api/resources/update/${id}`, undefined, { method: 'POST', body: JSON.stringify(data) });
}

async function addResource(data: unknown) {
  return await fetchData<Resource>('/api/resources/add', undefined, { method: 'POST', body: JSON.stringify(data) });
}

export function EditResource({ resourceInput, availableResourceTypes, settlementId, settlementSlug, className, onUpdate }: EditResourceProps) {
  const [resource, setCurrentResource] = useState<Resource | undefined>(resourceInput);
  const [resourceType, setResourceType] = useState<ResourceType>(resource?.resourceType ?? availableResourceTypes[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uuid] = useState<string>(uuidv4());

  function setResource(input: Partial<Resource>) {
    setCurrentResource({
      ...resource,
      ...input,
    } as Resource);
  }

  async function deleteResource(id: string) {
    setLoading(true);
    await fetchData(`/api/resources/delete/${id}`);
    setCurrentResource(undefined); // todo: check if deletion is successful
    onUpdate(id);
    setLoading(false);
  }

  async function submitData(resource: Resource, resourceTypeId: string, settlementId: string) {
    setLoading(true);
    let response;
    if (resource?.id) {
      const data = {
        name: resource.name,
        description: resource.description,
        source: resource.source,
        url: resource.url,
        license: resource.license,
        copyright: resource.copyright,
        resourceTypeId: resourceTypeId,
      };
      response = await updateResource(resource.id, data);
    } else {
      const data = {
        name: resource.name,
        description: resource.description,
        source: resource.source,
        url: resource.url,
        license: resource.license,
        copyright: resource.copyright,
        resourceTypeId: resourceTypeId,
        settlementId: settlementId,
      };
      response = await addResource(data);
    }
    setCurrentResource(response);
    onUpdate(response.id);
    setLoading(false);
  }

  function imageUploadCallback(images: ImageResponse[]) {
    if (images.length !== 1) {
      setResource({
        url: undefined
      });

      return;
    }
    const image = images[0];
    setResource({
      url: image.url
    });
  }

  return (
    <div className={className}>
      {resource?.resourceType?.name === 'Foto' && resource?.url && (
        <LightBox src={resource?.url} className="mb-2" />
      )}
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceType', uuid)}>Typ:</label>
          <Select<ResourceType>
            id={getUniqueLabel('resourceType', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.resourceType?.id ?? ''}
            options={availableResourceTypes}
            onChange={(event) => setResourceType(availableResourceTypes.find(resourceType => resourceType.id === event.target.value)!)} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceName', uuid)}>Name:</label>
          <InputGhost
            id={getUniqueLabel('resourceName', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.name ?? ''}
            onChange={(event) => setResource({ name: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceCopyright', uuid)}>Copyright:</label>
          <InputGhost
            id={getUniqueLabel('resourceCopyright', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.copyright ?? ''}
            onChange={(event) => setResource({ copyright: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceSource', uuid)}>Quelle:</label>
          <InputGhost
            id={getUniqueLabel('resourceSource', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.source ?? ''}
            onChange={(event) => setResource({ source: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceDescription', uuid)}>Beschreibung:</label>
          <InputGhost
            id={getUniqueLabel('resourceDescription', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.description ?? ''}
            onChange={(event) => setResource({ description: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceLicense', uuid)}>Lizenz:</label>
          <InputGhost
            id={getUniqueLabel('resourceLicense', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.license ?? ''}
            onChange={(event) => setResource({ license: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        {resourceType?.name === 'Foto' ?
          (
            <div className='basis-full overflow-hidden'>
              <label htmlFor={getUniqueLabel('resourceImage', uuid)}>Foto:</label>
              <Upload
                className='mt-1 mb-2'
                id={getUniqueLabel('resourceImage', uuid)}
                onUpload={imageUploadCallback}
                category={settlementSlug} />
            </div>
          ) : (
            <div className='basis-full'>
              <label htmlFor={getUniqueLabel('resourceUrl', uuid)}>URL:</label>
              <InputGhost
                id={getUniqueLabel('resourceUrl', uuid)}
                className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
                value={resource?.url ?? ''}
                onChange={(event) => setResource({ url: event.target.value })} />
            </div>)
        }
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2 mb-1'>
        <Button
          className='w-full'
          onClick={resource ? () => submitData(resource, resourceType.id, settlementId) : () => { return; }}
          disabled={loading || !resource?.name || (resourceType?.name === 'Foto' && !resource.url)}>
          {resource?.id ? 'Speichern' : 'Hinzufügen'}
          {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
        </Button>
        {resource?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteResource(resource.id)}
            disabled={loading || !(resource?.name)}>
            Löschen
            {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
          </Button>
        )}
      </div>
    </div>
  );
}