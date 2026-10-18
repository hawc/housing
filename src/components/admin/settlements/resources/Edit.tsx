'use client';

import { useId, useState } from 'react';
import { fetchMutation } from '@/lib/fetch';
import type { Resource, ResourceType } from '@/lib/types';
import { resourceFormValues } from '@/lib/settlementFormFields';
import { ResourceFields } from '@/components/admin/settlements/forms/RecordFields';
import { Button } from '@/components/common/form/Button';
import { Upload } from '@/components/common/form/Upload';
import type { ImageResponse } from '@/app/api/upload/UploadLogic';
import { LightBox } from '@/components/common/LightBox';

async function updateResource(id: string, data: unknown) {
  return fetchMutation<Resource>(`/api/resources/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
async function addResource(data: unknown) {
  return fetchMutation<Resource>('/api/resources/add', {
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
  const [resource, setResource] = useState(resourceInput);
  const [fields, setFields] = useState(() => ({
    ...resourceFormValues(resourceInput),
    resourceTypeId:
      resourceInput?.resourceType.id ?? availableResourceTypes[0]?.id ?? '',
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const id = useId();
  const isPhoto =
    availableResourceTypes.find((type) => type.id === fields.resourceTypeId)
      ?.name === 'Foto';

  async function submitData() {
    setError('');
    setLoading(true);
    try {
      const response = resource?.id
        ? await updateResource(resource.id, fields)
        : await addResource({ ...fields, settlementId });
      if (!response)
        throw new Error('Der Eintrag konnte nicht gespeichert werden.');
      setResource(response);
      setFields(resourceFormValues(response));
      onUpdate(response.id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Speichern fehlgeschlagen. Bitte erneut versuchen.',
      );
    } finally {
      setLoading(false);
    }
  }
  async function deleteResource(id: string) {
    setError('');
    setLoading(true);
    try {
      await fetchMutation(`/api/resources/delete/${id}`, { method: 'GET' });
      setResource(undefined);
      setFields(resourceFormValues());
      onUpdate(id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Löschen fehlgeschlagen. Bitte erneut versuchen.',
      );
    } finally {
      setLoading(false);
    }
  }
  function imageUploadCallback(images: ImageResponse[]) {
    setFields((current) => ({
      ...current,
      url: images.length === 1 ? images[0].url : '',
    }));
  }

  return (
    <div className={className}>
      {error && (
        <p role='alert' className='border border-text p-2 mb-3'>
          {error}
        </p>
      )}
      {isPhoto && fields.url && <LightBox src={fields.url} className='mb-2' />}
      <ResourceFields
        value={fields}
        onChange={setFields}
        types={availableResourceTypes}
        disabled={loading}
      />
      {isPhoto && (
        <div className='mt-3'>
          <label htmlFor={id}>Foto hochladen:</label>
          <Upload
            className='mt-1 mb-2'
            id={id}
            onUpload={imageUploadCallback}
            category={settlementSlug}
          />
        </div>
      )}
      <div className='flex gap-4 flex-col lg:flex-row mt-2 mb-1'>
        <Button
          className='w-full'
          onClick={submitData}
          disabled={
            !fields.name || !fields.resourceTypeId || (isPhoto && !fields.url)
          }
          loading={loading}
        >
          {resource?.id ? 'Speichern' : 'Hinzufügen'}
        </Button>
        {resource?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteResource(resource.id)}
            loading={loading}
          >
            Löschen
          </Button>
        )}
      </div>
    </div>
  );
}
