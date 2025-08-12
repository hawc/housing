'use client';

import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Architect, BaseArchitect } from '@/lib/types';

import { ArchitectsItem } from '@/components/admin/settlements/architects/Item';
import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { Select } from '@/components/common/form/Select';
import { sortAlphabetically } from '@/utils/sortAlphabetically';

async function getArchitects() {
  const architects = await fetchData<BaseArchitect[]>('/api/architects/get/all', undefined);

  return architects;
}

interface ArchitectsListProps {
  architects: Architect[];
  settlementId: string;
  getSettlement: () => Promise<void>;
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

  async function updateArchitectOnSettlement(architectId: string, settlementId: string, role: string) {
    setLoading(true);
    await fetchData(`/api/architects/update/settlement/${architectId}/${settlementId}`, undefined, { method: 'POST', body: JSON.stringify({ role }) });
    setCurrentArchitect(undefined);
    await getSettlement();
    setLoading(false);
  }

  const addArchitect = useCallback(async (architectId: string, settlementId: string, role: string | undefined) => {
    setLoading(true);
    await fetchData(`/api/settlements/add/architect/${settlementId}/${architectId}`, undefined, { method: 'POST', body: JSON.stringify({ role: role }) });
    await getSettlement();
    setLoading(false);
  }, [getSettlement]);

  const handleSetArchitectRole = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const role = event.target.value;

    if (!role || !currentArchitect?.id) {
      return;
    }

    setCurrentArchitect({
      ...currentArchitect,
      role: event.target.value
    });
  }, [currentArchitect]);

  const handleAddArchitect = useCallback(() => {
    if (!currentArchitect?.id) {
      return;
    }

    addArchitect(currentArchitect.id, settlementId, currentArchitect.role);
  }, [addArchitect, currentArchitect, settlementId]);

  useEffect(() => {
    getAvailableArchitects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`grid transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      <div className="flex flex-col">
        {architects && sortAlphabetically(architects).map((architect: Architect) => (
          <Fragment key={architect.id}>
            <ArchitectsItem
              removeArchitect={removeArchitect}
              updateArchitectOnSettlement={updateArchitectOnSettlement}
              architect={architect}
              settlementId={settlementId} />
            <hr className='mb-4 mt-6 border' />
          </Fragment>
        ))}
      </div>
      <div>
        <label htmlFor="settlementArchitectSelect"
          className='mb-1 block'>Architekt*in hinzufügen:</label>
        <div className="grid gap-4">
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
              <InputGhost
                value={currentArchitect?.role ?? ''}
                className='border-highlight border-2 border-solid p-1 w-full'
                placeholder="Rolle"
                disabled={!currentArchitect}
                onChange={handleSetArchitectRole}
              />
            </div>
          </div>
          <div className='flex'>
            <div className='basis-full'>
              <Button
                className='border-highlight border-2 border-solid w-full'
                disabled={!currentArchitect}
                onClick={handleAddArchitect}>
                Hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}