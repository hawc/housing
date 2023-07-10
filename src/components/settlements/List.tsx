import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { SettlementsSearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

import { BaseSettlement } from '@/pages/admin';

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [settlements, setSettlements] = useState(settlementsInput);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  return (
    <>
      <Box>
        <div className='flex'>
          <Headline type='h1' className='mb-0 inline-block'>Siedlungen: Übersicht</Headline>
          <Button className='ml-3 p-2 rounded-full' onClick={() => getSettlements()}>
            <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
          </Button>
        </div>
      </Box>
      <Box>
        <div className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}>
          {!loading && !settlements ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <SettlementsSearchList path='/siedlungen/' loading={Boolean(loading && settlements)} items={settlements} />
          )}
        </div>
      </Box>
    </>
  );
}
