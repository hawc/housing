'use client';

import type { Prisma } from '@prisma/client';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { fetchData } from '@/lib/fetch';
import type { ExternalLink, Platform } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { getUniqueLabel } from '@/utils/getUniqueLabel';

interface EditExternalLinkProps {
  externalLinkInput: ExternalLink | undefined;
  architectId: string;
  className?: string;
  onUpdate: (externalLinkId: string | undefined) => void;
}

async function getRelatedPlatform(data: Prisma.ExternalLinksUncheckedUpdateInput) {
  const platforms = await fetchData<Platform[], Platform[]>('/api/platforms/get/all', []);
  return platforms.find(platform => platform.urlIdentifier && String(data.url).includes(platform.urlIdentifier));
}

async function updateExternalLink(id: string, data: Prisma.ExternalLinksUncheckedUpdateInput) {
  const relatedPlatform = await getRelatedPlatform(data);
  data.platformId = relatedPlatform ? relatedPlatform.id : null;
  return await fetchData<ExternalLink>(`/api/externalLinks/update/${id}`, undefined, { method: 'POST', body: JSON.stringify(data) });
}

async function addExternalLink(data: Prisma.ExternalLinksUncheckedCreateInput) {
  const relatedPlatform = await getRelatedPlatform(data);
  data.platformId = relatedPlatform ? relatedPlatform.id : null;
  return await fetchData<ExternalLink>('/api/externalLinks/add', undefined, { method: 'POST', body: JSON.stringify(data) });
}

export function EditExternalLink({ externalLinkInput, architectId, onUpdate, className }: EditExternalLinkProps) {
  const [externalLink, setCurrentExternalLink] = useState<ExternalLink | undefined>(externalLinkInput);
  const [loading, setLoading] = useState<boolean>(false);
  const [uuid] = useState<string>(uuidv4());

  function setExternalLink(input: Partial<ExternalLink>) {
    setCurrentExternalLink({
      ...externalLink,
      ...input,
    } as ExternalLink);
  }

  async function deleteExternalLink(id: string) {
    setLoading(true);
    await fetchData(`/api/externalLinks/delete/${id}`);
    setCurrentExternalLink(undefined); // todo: check if deletion is successful
    onUpdate(id);
    setLoading(false);
  }

  async function submitData(externalLink: ExternalLink, architectId: string) {
    setLoading(true);
    let response;
    if (externalLink?.id) {
      const data: Prisma.ExternalLinksUncheckedUpdateInput = {
        name: externalLink.name,
        description: externalLink.description,
        url: externalLink.url,
        architectId: architectId,
      };
      response = await updateExternalLink(externalLink.id, data);
    } else {
      const data: Prisma.ExternalLinksUncheckedCreateInput = {
        name: externalLink.name,
        description: externalLink.description,
        url: externalLink.url,
        architectId: architectId,
      };
      response = await addExternalLink(data);
    }
    setCurrentExternalLink(response);
    onUpdate(response.id);
    setLoading(false);
  }

  return (
    <div className={className}>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('externalLinkName', uuid)}>Name:</label>
          <InputGhost
            id={getUniqueLabel('externalLinkName', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={externalLink?.name ?? ''}
            onChange={(event) => setExternalLink({ name: event.target.value })} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('externalLinkDescription', uuid)}>Beschreibung:</label>
          <TextareaGhost
            id={getUniqueLabel('externalLinkDescription', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={externalLink?.description ?? ''}
            onChange={(event) => setExternalLink({ description: event.target.value })} />
        </div>
        <div className='basis-full'>
          <label htmlFor={getUniqueLabel('externalLinkUrl', uuid)}>URL:</label>
          <InputGhost
            id={getUniqueLabel('externalLinkUrl', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={externalLink?.url ?? ''}
            onChange={(event) => setExternalLink({ url: event.target.value })} />
          <label htmlFor={getUniqueLabel('externalLinkUrl', uuid)}>Plattform:</label>
          <InputGhost
            id={getUniqueLabel('externalLinkPlatform', uuid)}
            className='mt-1 border-highlight border-solid border-2 mb-2 p-1'
            value={externalLink?.platform?.name ?? ''}
            disabled />
        </div>
      </div>
      <div className='flex gap-4 flex-col lg:flex-row mt-2'>
        <Button
          className='w-full'
          onClick={() => externalLink && submitData(externalLink, architectId)}
          disabled={loading || !(externalLink?.url)}><>{externalLink?.id ? 'Speichern' : 'Hinzufügen'}
            {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
        </Button>
        {externalLink?.id && (
          <Button
            className='w-full bg-text text-bg border border-text'
            onClick={() => deleteExternalLink(externalLink.id)}
            disabled={loading}><>Löschen</>
          </Button>
        )}
      </div>
    </div>
  );
}