'use client';

import { useId, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Resource, ResourceType } from '@/lib/types';

import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { Select } from '@/components/common/form/Select';
import { Upload } from '@/components/common/form/Upload';

import { ImageResponse } from '@/app/api/upload/UploadLogic';
import { LightBox } from '@/components/common/LightBox';
import { getUniqueLabel } from '@/utils/getUniqueLabel';

async function updateResource(id: string, data: unknown) {
  return await fetchData<Resource>(`/api/resources/update/${id}`, undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function addResource(data: unknown) {
  return await fetchData<Resource>('/api/resources/add', undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

interface EditResourceProps {
  resourceInput: Resource | undefined;
  availableResourceTypes: ResourceType[];
  settlementId: string;
  settlementSlug: string;
  className?: string;
  onUpdate: (resourceId: string | undefined) => void;
}

export function EditResource({
  resourceInput,
  availableResourceTypes,
  settlementId,
  settlementSlug,
  className,
  onUpdate,
}: EditResourceProps) {
  const [resource, setCurrentResource] = useState<Resource | undefined>(
    resourceInput,
  );
  const [resourceType, setResourceType] = useState<ResourceType>(
    resource?.resourceType ?? availableResourceTypes[0],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const id = useId();

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

  async function submitData(
    resource: Resource,
    resourceTypeId: string,
    settlementId: string,
  ) {
    setLoading(true);
    let response;

    const data = {
      name: resource.name,
      description: resource.description,
      source: resource.source,
      url: resource.url,
      license: resource.license,
      copyright: resource.copyright,
      resourceTypeId: resourceTypeId,
    };

    if (resource?.id) {
      response = await updateResource(resource.id, data);
    } else {
      response = await addResource({ ...data, settlementId });
    }

    setCurrentResource(response);
    onUpdate(response.id);
    setLoading(false);
  }

  function imageUploadCallback(images: ImageResponse[]) {
    if (images.length !== 1) {
      setResource({
        url: undefined,
      });

      return;
    }
    const image = images[0];
    setResource({
      url: image.url,
    });
  }

  return (
    <div className={className}>
      {resource?.resourceType?.name === 'Foto' && resource?.url && (
        <LightBox src={resource?.url} className='mb-2' />
      )}
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceType', id)}>Typ:</label>
          <Select<ResourceType>
            id={getUniqueLabel('resourceType', id)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.resourceType?.id ?? ''}
            options={availableResourceTypes}
            onChange={(event) =>
              setResourceType(
                availableResourceTypes.find(
                  (resourceType) => resourceType.id === event.target.value,
                )!,
              )
            }
          />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceName', id)}>Name:</label>
          <InputGhost
            id={getUniqueLabel('resourceName', id)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.name ?? ''}
            onChange={(event) => setResource({ name: event.target.value })}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceCopyright', id)}>
            Copyright:
          </label>
          <InputGhost
            id={getUniqueLabel('resourceCopyright', id)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.copyright ?? ''}
            onChange={(event) => setResource({ copyright: event.target.value })}
          />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceSource', id)}>
            Quelle:
          </label>
          <InputGhost
            id={getUniqueLabel('resourceSource', id)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.source ?? ''}
            onChange={(event) => setResource({ source: event.target.value })}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceDescription', id)}>
            Beschreibung:
          </label>
          <InputGhost
            id={getUniqueLabel('resourceDescription', id)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.description ?? ''}
            onChange={(event) =>
              setResource({ description: event.target.value })
            }
          />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('resourceLicense', id)}>
            Lizenz:
          </label>
          <InputGhost
            id={getUniqueLabel('resourceLicense', id)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={resource?.license ?? ''}
            onChange={(event) => setResource({ license: event.target.value })}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        {resourceType?.name === 'Foto' ? (
          <div className='basis-full overflow-hidden'>
            <label htmlFor={getUniqueLabel('resourceImage', id)}>Foto:</label>
            <Upload
              className='mt-1 mb-2'
              id={getUniqueLabel('resourceImage', id)}
              onUpload={imageUploadCallback}
              category={settlementSlug}
            />
          </div>
        ) : (
          <div className='basis-full'>
            <label htmlFor={getUniqueLabel('resourceUrl', id)}>URL:</label>
            <InputGhost
              id={getUniqueLabel('resourceUrl', id)}
              className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
              value={resource?.url ?? ''}
              onChange={(event) => setResource({ url: event.target.value })}
            />
          </div>
        )}
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2 mb-1'>
        <Button
          className='w-full'
          onClick={() =>
            resource
              ? submitData(resource, resourceType.id, settlementId)
              : undefined
          }
          disabled={
            !resource?.name || (resourceType?.name === 'Foto' && !resource.url)
          }
          loading={loading}
        >
          {resource?.id ? 'Speichern' : 'Hinzufügen'}
        </Button>
        {resource?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteResource(resource.id)}
            disabled={!resource?.name}
            loading={loading}
          >
            Löschen
          </Button>
        )}
      </div>
    </div>
  );
}
