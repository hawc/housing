import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { dateIsValid } from '@/components/admin/settlements/Event';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Select } from '@/components/blocks/form/Select';

import { Detail, DetailType } from '@/pages/admin';

interface EditDetailProps extends React.HTMLAttributes<HTMLElement> {
  detailInput: Detail | undefined;
  availableDetailTypes: DetailType[];
  settlementId: string | null;
  onUpdate: (detailId: string | undefined) => void;
}

export function EditDetail({ detailInput, availableDetailTypes, settlementId, onUpdate, ...rest }: EditDetailProps) {
  const [detail, setCurrentDetail] = useState<Detail | undefined>(detailInput);
  const [detailTypeId, setDetailTypeId] = useState<string | undefined>(detail?.detailType?.id ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const updateDetail = (input: Partial<Detail>) => {
    setCurrentDetail({
      ...detail,
      ...input,
    } as Detail)
  }

  const deleteDetail = async (id: string) => {
    setLoading(true);
    const submitData = {
      type: 'updateDetail',
      payload: {
        data: {
          published: false
        },
        where: { id }
      }
    };
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentDetail(undefined);
    }
    onUpdate(id);
    setLoading(false);
  }

  const submitDetail = async (id: string) => {
    setLoading(true);
    let submitData;
    if (id) {
      submitData = {
        type: 'updateDetail',
        payload: {
          data: {
            name: detail.name,
            description: detail.description,
            annotation: detail.annotation,
            source: detail.source,
            detailDate: detail.detailDate ? new Date(detail.detailDate) : null,
            detailTypeId: detailTypeId,
          },
          where: { id }
        }
      };
    } else {
      submitData = {
        type: 'addDetail',
        payload: {
          data: {
            name: detail.name,
            description: detail.description,
            annotation: detail.annotation,
            source: detail.source,
            detailDate: detail.detailDate ? new Date(detail.detailDate) : null,
            detailTypeId: detailTypeId,
            settlementId: settlementId,
          },
        }
      };
    }
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentDetail(response);
    }
    onUpdate(id);
    setLoading(false);
  }

  return (
    <div {...rest}>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor="detailName">Name:</label>
          <InputGhost
            id='detailName'
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.name ?? ''}
            onChange={(event) => updateDetail({ name: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor="detailType">Typ:</label>
          <Select<DetailType>
            id='detailType'
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.detailType?.id ?? ''}
            options={availableDetailTypes}
            onChange={(detail) => setDetailTypeId(detail.target.value)} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor="detailDescription">Wert:</label>
          <InputGhost
            id='detailDescription'
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.description ?? ''}
            onChange={(event) => updateDetail({ description: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor="detailAnnotation">Anmerkung:</label>
          <InputGhost
            id='detailAnnotation'
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.annotation ?? ''}
            onChange={(event) => updateDetail({ annotation: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor="detailDate">Datum:</label>
          <InputGhost
            type='date'
            id='detailDate'
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.detailDate ?? new Date().toDateString()}
            onChange={(event) => updateDetail({ detailDate: dateIsValid(event.target.value) ? new Date(new Date(event.target.value).toUTCString()).toISOString() : null })} />
        </div>
        <div className='basis-full'>
          <label htmlFor="detailSource">Quelle:</label>
          <InputGhost
            id='detailSource'
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={detail?.source ?? ''}
            onChange={(event) => updateDetail({ source: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2'>
        <Button
          className='w-full'
          onClick={() => submitDetail(detail?.id)}
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