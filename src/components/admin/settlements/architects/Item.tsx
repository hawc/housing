import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { Architect } from '@/lib/types';
import { useState } from 'react';

interface ArchitectsItemProps {
  architect: Architect;
  settlementId: string;
  removeArchitect: (id, settlementId) => void;
  updateArchitectOnSettlement: (id, settlementId, role) => void;
}

export function ArchitectsItem({ architect, settlementId, removeArchitect, updateArchitectOnSettlement, ...rest }: ArchitectsItemProps) {
  const [role, setRole] = useState(architect.role ?? '');
  return (
    <div className="grid gap-4" {...rest}>
      <div className='flex gap-3 items-center'>
        Name: <div>{architect.name}</div>
      </div>
      <div className='flex gap-4 items-center'>
        Rolle: <InputGhost
          className='border-highlight border-2 border-solid p-1' value={architect.role ?? ''} onChange={e => setRole(e.target.value)} />
      </div>
      <div className='flex gap-4'>
        <div className='basis-full'>
          <Button
            className='border-highlight border-2 border-solid w-full'
            onClick={() => updateArchitectOnSettlement(architect.id, settlementId, role)}>
            Speichern
          </Button>
        </div>
        <div className='basis-full'>
          <Button
            className='bg-text text-bg border-2 border-solid border-text w-full'
            onClick={() => removeArchitect(architect.id, settlementId)}>
            Löschen
          </Button>
        </div>
      </div>
    </div>
  );
}
