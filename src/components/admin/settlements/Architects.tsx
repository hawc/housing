'use client';

import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import { sortAlphabetically } from '@/lib/utils';

import { Button } from '@/components/blocks/form/Button';
import { Select } from '@/components/blocks/form/Select';

import { Architect, BaseArchitect } from '@/app/admin/page';

interface ArchitectsItemProps extends React.HTMLAttributes<HTMLElement> {
  architect: Architect;
  settlementId: string;
  removeArchitect: (id, settlementId) => void
}

interface ArchitectsListProps extends React.HTMLAttributes<HTMLElement> {
  architects: Architect[];
  settlementId: string;
  getSettlement: () => Promise<void>;
}

async function getArchitects() {
  const architects = await fetchData<BaseArchitect[]>('/api/architects/get/all', undefined, {
    cache: 'no-cache'
  });

  return architects;
}

export function ArchitectsItem({ architect, settlementId, removeArchitect, ...rest }: ArchitectsItemProps) {
  return (
    <div {...rest}>
      {architect.name} <Button onClick={() => removeArchitect(architect.id, settlementId)} className='p-0.5 rounded-full'><XIcon size={15} /></Button>
    </div>
  );
}

export function ArchitectsList({ architects, settlementId, getSettlement }: ArchitectsListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableArchitects, setAvailableArchitects] = useState<Architect[]>([]);
  const [currentArchitect, setCurrentArchitect] = useState<Architect | undefined>(undefined);

  async function getAvailableArchitects() {
    setLoading(true);
    const responseArchitects = await getArchitects();
    if (responseArchitects) {
      const filteredArchitects = responseArchitects.filter(responseArchitect => !architects?.map(architect => architect.id).includes(responseArchitect.id));
      setAvailableArchitects(filteredArchitects ?? []);
    }
    setLoading(false);
  }

  async function removeArchitect(architectId: string, settlementId: string) {
    setLoading(true);
    await fetchData(`/api/architects/delete/settlement/${architectId}/${settlementId}`);
    setCurrentArchitect(undefined);
    await getSettlement();
    setLoading(false);
  }

  async function addArchitect(architectId: string, settlementId: string) {
    setLoading(true);
    await fetchData(`/api/settlements/add/architect/${settlementId}/${architectId}`);
    await getSettlement();
    setLoading(false);
  }

  useEffect(() => {
    getAvailableArchitects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`grid gap-4 transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      <div>
        {architects && sortAlphabetically(architects).map((architect: Architect) => (
          <ArchitectsItem
            removeArchitect={removeArchitect}
            key={architect.id}
            architect={architect}
            settlementId={settlementId} />
        ))}
      </div>
      <div>
        <label htmlFor="settlementArchitectSelect"
          className='mb-1 block'>Architekt*in hinzufügen:</label>
        <div className='flex gap-4'>
          <div className='basis-full'>
            <Select
              onChange={(event) => setCurrentArchitect(availableArchitects.find(architect => architect.id === event.target.value))}
              value={currentArchitect?.id}
              id='settlementArchitectSelect'
              options={availableArchitects}
              className='border-highlight border-2 border-solid p-1 w-full' />
          </div>
          <div className='basis-full'>
            <Button
              className='border-highlight border-2 border-solid w-full'
              disabled={!currentArchitect}
              onClick={currentArchitect?.id ? () => addArchitect(currentArchitect.id, settlementId) : () => { return; }}>
              Hinzufügen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}