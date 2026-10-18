'use client';

import type { Prisma } from '@prisma/client';
import { useState } from 'react';
import { fetchMutation } from '@/lib/fetch';
import type { Detail, DetailType } from '@/lib/types';
import {
  detailFormValues,
  requiresDetailDate,
} from '@/lib/settlementFormFields';
import { DetailFields } from '@/components/admin/settlements/forms/RecordFields';
import { detailValueError } from '@/lib/detailValue';
import { detailScopeError } from '@/lib/detailScope';
import { Button } from '@/components/common/form/Button';

async function updateDetail(
  id: string,
  data: Prisma.DetailsUncheckedUpdateInput,
) {
  return fetchMutation<Detail>(`/api/details/update/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
async function addDetail(data: Prisma.DetailsUncheckedCreateInput) {
  return fetchMutation<Detail>('/api/details/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

interface EditDetailProps {
  detailInput: Detail | undefined;
  availableDetailTypes: DetailType[];
  settlementId: string;
  className?: string;
  onUpdate: (detailId: string | undefined) => void;
}

export function EditDetail({
  detailInput,
  availableDetailTypes,
  settlementId,
  className,
  onUpdate,
}: EditDetailProps) {
  const [detail, setDetail] = useState(detailInput);
  const [fields, setFields] = useState(() => detailFormValues(detailInput));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const typeName =
    availableDetailTypes.find((type) => type.id === fields.detailTypeId)
      ?.name ?? '';

  async function submitData() {
    if (detailValueError(typeName, fields.description)) return;
    if (detailScopeError(typeName, fields.annotation)) return;
    setError('');
    setLoading(true);
    try {
      const data = {
        ...fields,
        name: fields.name || typeName,
        detailDate: fields.detailDate
          ? new Date(`${fields.detailDate}T00:00:00.000Z`)
          : null,
      };
      const response = detail?.id
        ? await updateDetail(detail.id, data)
        : await addDetail({ ...data, settlementId });
      if (!response)
        throw new Error('Der Eintrag konnte nicht gespeichert werden.');
      setDetail(response);
      setFields(detailFormValues(response));
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

  async function deleteDetail(id: string) {
    setError('');
    setLoading(true);
    try {
      await fetchMutation(`/api/details/delete/${id}`, { method: 'GET' });
      setDetail(undefined);
      setFields(detailFormValues());
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

  return (
    <div className={className}>
      {error && (
        <p role='alert' className='border border-text p-2 mb-3'>
          {error}
        </p>
      )}
      <DetailFields
        value={fields}
        onChange={setFields}
        types={availableDetailTypes}
        disabled={loading}
      />
      <div className='flex gap-4 flex-col lg:flex-row mt-2'>
        <Button
          className='w-full'
          onClick={submitData}
          disabled={
            !fields.detailTypeId ||
            Boolean(detailValueError(typeName, fields.description)) ||
            Boolean(detailScopeError(typeName, fields.annotation)) ||
            (!fields.name && !typeName) ||
            (requiresDetailDate(typeName) && !fields.detailDate)
          }
          loading={loading}
        >
          {detail?.id ? 'Speichern' : 'Hinzufügen'}
        </Button>
        {detail?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteDetail(detail.id)}
            loading={loading}
          >
            Löschen
          </Button>
        )}
      </div>
    </div>
  );
}
