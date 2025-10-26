'use client';

import type { Prisma } from '@prisma/client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { fetchData } from '@/lib/fetch';
import type { Detail, DetailType } from '@/lib/types';

import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { Select } from '@/components/common/form/Select';
import { getUniqueLabel } from '@/utils/getUniqueLabel';
import { isDateValid } from '@/utils/isDateValid';

function getDescriptionInputType(detailType?: DetailType['name']) {
  switch (detailType) {
    case 'Gebäudezahl':
    case 'Einwohner*innen':
    case 'Fläche (in km²)':
    case 'Wohneinheiten':
      return 'number';
    case 'Bauträger':
    default:
      return 'text';
  }
}

async function updateDetail(
  id: string,
  data: Prisma.DetailsUncheckedUpdateInput
) {
  return await fetchData<Detail>(`/api/details/update/${id}`, undefined, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function addDetail(data: Prisma.DetailsUncheckedCreateInput) {
  return await fetchData<Detail>('/api/details/add', undefined, {
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
  const [detail, setCurrentDetail] = useState<Detail | undefined>(detailInput);
  const [detailTypeId, setDetailTypeId] = useState<string>(
    detail?.detailType?.id ?? ''
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [uuid] = useState<string>(uuidv4());

  const detailTypeName = availableDetailTypes.find(
    (type) => type.id === detailTypeId
  )?.name;

  function setDetail(input: Partial<Detail>) {
    setCurrentDetail({
      ...detail,
      ...input,
    } as Detail);
  }

  async function deleteDetail(id: string) {
    setLoading(true);
    await fetchData(`/api/details/delete/${id}`);
    setCurrentDetail(undefined); // todo: check if deletion is successful
    onUpdate(id);
    setLoading(false);
  }

  async function submitData(
    detail: Detail,
    detailTypeId: string,
    settlementId: string
  ) {
    setLoading(true);
    let response;
    if (detail?.id) {
      const data: Prisma.DetailsUncheckedUpdateInput = {
        name: detail.name,
        description: detail.description,
        annotation: detail.annotation,
        source: detail.source,
        detailDate: detail.detailDate ? new Date(detail.detailDate) : undefined,
        detailTypeId: detailTypeId,
      };
      response = await updateDetail(detail.id, data);
    } else {
      const data: Prisma.DetailsUncheckedCreateInput = {
        name: detail.name || detailTypeName || '',
        description: detail.description,
        annotation: detail.annotation,
        source: detail.source,
        detailDate: detail.detailDate ? new Date(detail.detailDate) : undefined,
        detailTypeId: detailTypeId,
        settlementId: settlementId,
      };
      response = await addDetail(data);
    }
    setCurrentDetail(response);
    onUpdate(response.id);
    setLoading(false);
  }

  return (
    <div className={className}>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailType', uuid)}>Typ:</label>
          <Select<DetailType>
            id={getUniqueLabel('detailType', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.detailType?.id ?? ''}
            options={availableDetailTypes}
            onChange={(detail) => setDetailTypeId(detail.target.value)}
          />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailName', uuid)}>Name:</label>
          <InputGhost
            id={getUniqueLabel('detailName', uuid)}
            placeholder={detailTypeName}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.name ?? ''}
            onChange={(event) => setDetail({ name: event.target.value })}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailDescription', uuid)}>
            Wert:
          </label>
          <InputGhost
            id={getUniqueLabel('detailDescription', uuid)}
            type={getDescriptionInputType(detail?.detailType?.name)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.description ?? ''}
            onChange={(event) => setDetail({ description: event.target.value })}
          />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailAnnotation', uuid)}>
            Anmerkung:
          </label>
          <InputGhost
            id={getUniqueLabel('detailAnnotation', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.annotation ?? ''}
            onChange={(event) => setDetail({ annotation: event.target.value })}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailDate', uuid)}>Datum:</label>
          <InputGhost
            type='date'
            id={getUniqueLabel('detailDate', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.detailDate}
            onChange={(event) =>
              setDetail({
                detailDate: isDateValid(event.target.value)
                  ? new Date(
                      new Date(event.target.value).toUTCString()
                    ).toISOString()
                  : undefined,
              })
            }
          />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailSource', uuid)}>Quelle:</label>
          <InputGhost
            id={getUniqueLabel('detailSource', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.source ?? ''}
            onChange={(event) => setDetail({ source: event.target.value })}
          />
        </div>
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2'>
        <Button
          className='w-full'
          onClick={() =>
            detail && submitData(detail, detailTypeId, settlementId)
          }
          disabled={!detail?.name && !detailTypeName}
          loading={loading}
        >
          {detail?.id ? 'Speichern' : 'Hinzufügen'}
        </Button>
        {detail?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteDetail(detail.id)}
            disabled={!detail?.name && !detailTypeName}
            loading={loading}
          >
            Löschen
          </Button>
        )}
      </div>
    </div>
  );
}
