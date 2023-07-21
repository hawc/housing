import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { Select } from '@/components/blocks/form/Select';

import { Architect } from '@/pages/admin';

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

export function ArchitectsItem({ architect, settlementId, removeArchitect, ...rest }: ArchitectsItemProps) {
  return <div {...rest}>
    {architect.name} <Button onClick={() => removeArchitect(architect.id, settlementId)} className='p-0.5 rounded-full'><XIcon size={15} /></Button>
  </div>;
}

export function ArchitectsList({ architects, settlementId, getSettlement }: ArchitectsListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableArchitects, setAvailableArchitects] = useState<Architect[]>([]);
  const [currentArchitect, setCurrentArchitect] = useState<Architect | undefined>(undefined);

  const getAvailableArchitects = async () => {
    setLoading(true);
    const responseArchitects = (await callAPI({ type: 'getArchitects' }));
    setAvailableArchitects(responseArchitects.filter(responseArchitect => !architects?.map(architect => architect.id).includes(responseArchitect.id)));
    setLoading(false);
  }

  const removeArchitect = async (id, settlementId) => {
    const submitData = {
      type: 'updateArchitect',
      payload: {
        data: {
          settlements: {
            delete: {
              settlementId_architectId: {
                architectId: id,
                settlementId: settlementId,
              }
            }
          }
        },
        where: { id }
      }
    };
    const response = await callAPI(submitData);
    if (response?.id) {
      setCurrentArchitect(undefined);
    }
    await getSettlement();
    setLoading(false);
  }

  const addArchitect = async (architect) => {
    setLoading(true);
    await callAPI({
      type: 'addSettlementOnArchitect',
      payload: {
        data: {
          architectId: architect.id,
          settlementId: settlementId,
        }
      }
    });
    await getSettlement();
    setLoading(false);
  }

  useEffect(() => {
    getAvailableArchitects();
  }, []);

  return (
    <div className={`grid lg:grid-cols-2 gap-4 lg:gap-10 ${loading ? 'blur pointer-events-none' : ''}`}>
      <div>
        {architects?.map((architect: Architect) => (
          <ArchitectsItem
            removeArchitect={removeArchitect}
            key={architect.id}
            architect={architect}
            settlementId={settlementId} />
        ))}
      </div>
      <div>
        <label htmlFor="settlementArchitectSelect">Architekt hinzufügen:</label>
        <div className='mt-1 mb-1'>
          <Select
            onChange={(event) => setCurrentArchitect(availableArchitects.find(architect => architect.id === event.target.value))}
            value={currentArchitect?.id}
            id='settlementArchitectSelect'
            options={availableArchitects}
            className='border-highlight border-2 border-solid p-1 w-full mb-2' />
          <Button
            className='w-full'
            disabled={!currentArchitect}
            onClick={() => addArchitect(currentArchitect)}>
            Architekt hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
}