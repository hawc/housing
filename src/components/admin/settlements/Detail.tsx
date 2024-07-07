'use client';

import { Prisma } from '@prisma/client';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { fetchData } from '@/lib/fetch';
import type { Detail, DetailType } from '@/lib/types';
import { dateIsValid, getUniqueLabel } from '@/lib/utils';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';

interface EditDetailProps extends React.HTMLAttributes<HTMLElement> {
  detailInput: Detail | undefined;
  availableDetailTypes: DetailType[];
  settlementId: string;
  onUpdate: (detailId: string | undefined) => void;
}

function getDescriptionInputType(detailType) {
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

async function updateDetail(id: string, data: Prisma.DetailsUncheckedUpdateInput) {
  return await fetchData<Detail>(`/api/details/update/${id}`, undefined, { method: 'POST', body: JSON.stringify(data) });
}

async function addDetail(data: Prisma.DetailsUncheckedCreateInput) {
  return await fetchData<Detail>('/api/details/add', undefined, { method: 'POST', body: JSON.stringify(data) });
}

export function EditDetail({ detailInput, availableDetailTypes, settlementId, onUpdate, ...rest }: EditDetailProps) {
  const [detail, setCurrentDetail] = useState<Detail | undefined>(detailInput);
  const [detailTypeId, setDetailTypeId] = useState<string>(detail?.detailType?.id ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [uuid] = useState<string>(uuidv4());

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

  async function submitData(detail, detailTypeId: string, settlementId: string) {
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
        name: detail.name,
        description: detail.description,
        annotation: detail.annotation,
        source: detail.source,
        detailDate: detail.detailDate ? new Date(detail.detailDate) : undefined,
        detailTypeId: detailTypeId,
        settlementId: settlementId
      };
      response = await addDetail(data);
    }
    setCurrentDetail(response);
    onUpdate(response.id);
    setLoading(false);
  }

  return (
    <div {...rest}>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailType', uuid)}>Typ:</label>
          <Select<DetailType>
            id={getUniqueLabel('detailType', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.detailType?.id ?? ''}
            options={availableDetailTypes}
            onChange={(detail) => setDetailTypeId(detail.target.value)} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailName', uuid)}>Name:</label>
          <InputGhost
            id={getUniqueLabel('detailName', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.name ?? ''}
            onChange={(event) => setDetail({ name: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailDescription', uuid)}>Wert:</label>
          <InputGhost
            id={getUniqueLabel('detailDescription', uuid)}
            type={getDescriptionInputType(detail?.detailType?.name)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.description ?? ''}
            onChange={(event) => setDetail({ description: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailAnnotation', uuid)}>Anmerkung:</label>
          <InputGhost
            id={getUniqueLabel('detailAnnotation', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.annotation ?? ''}
            onChange={(event) => setDetail({ annotation: event.target.value })} />
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
            onChange={(event) => setDetail({ detailDate: dateIsValid(event.target.value) ? new Date(new Date(event.target.value).toUTCString()).toISOString() : undefined })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('detailSource', uuid)}>Quelle:</label>
          <InputGhost
            id={getUniqueLabel('detailSource', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.source ?? ''}
            onChange={(event) => setDetail({ source: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2'>
        <Button
          className='w-full'
          onClick={() => detail && submitData(detail, detailTypeId, settlementId)}
          disabled={loading || !(detail?.name)}><>{detail?.id ? 'Speichern' : 'Hinzufügen'}
            {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
        </Button>
        {detail?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteDetail(detail.id)}
            disabled={loading || !(detail?.name)}><>Löschen
              {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
          </Button>
        )}
      </div>
    </div>
  );
}