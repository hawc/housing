import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { Select } from '@/components/blocks/form/Select';

import { Architect } from '@/pages/admin';

interface ArchitectsItemProps extends React.HTMLAttributes<HTMLElement> {
  architect: Architect;
  settlementId: string;
}

interface ArchitectSelectProps extends React.HTMLAttributes<HTMLElement> {
  availableArchitects: Architect[];
  settlementId: string;
}

interface ArchitectsListProps extends React.HTMLAttributes<HTMLElement> {
  architectsInput: Architect[];
  settlementId: string;
}

export function ArchitectsItem({ architect, settlementId }: ArchitectsItemProps) {
  return <>{architect.name}</>;
}

export function ArchitectSelect({ availableArchitects, settlementId }: ArchitectSelectProps) {
  return <><Select options={availableArchitects} /></>;
}

export function ArchitectsList({ architectsInput, settlementId }: ArchitectsListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableArchitects, setAvailableArchitects] = useState<Architect[]>([]);
  const [architects, setArchitects] = useState<Architect[]>(architectsInput);

  const getAvailableArchitects = async () => {
    setLoading(true);
    const architects = (await callAPI({ type: 'getArchitects' }));
    setAvailableArchitects(architects);
    setLoading(false);
  }

  const getArchitects = async () => {
    setLoading(true);
    const architects = (await callAPI({ type: 'getArchitects', payload: { where: { settlementId } } }));
    setArchitects(architects);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableArchitects();
  }, []);

  return (
    <div>
      {architects?.map((architect: Architect) => (
        <ArchitectsItem
          // onUpdate={getArchitects}
          className='mb-4' key={architect.id} architect={architect} settlementId={settlementId} />
      ))}
      <ArchitectSelect
        key={architects.length}
        // onUpdate={getArchitects}
        availableArchitects={availableArchitects} settlementId={settlementId} />
    </div>
  );
}