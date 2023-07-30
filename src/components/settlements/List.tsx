import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { SearchInput, SettlementsSearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';
import { SettlementsMap } from '@/components/settlements/SettlementsMap';

import { BaseLocation, BaseSettlement } from '@/pages/admin';

export function ListSettlements({ settlementsInput, locationsInput }: { settlementsInput: BaseSettlement[], locationsInput: BaseLocation[] }) {
  const [searchTerm, setSearchTerm] = useState('');
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
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Siedlungen</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={() => getSettlements()}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Box>
        <div className="flex flex-col transition-filter">
          <SearchInput
            searchTerm={searchTerm}
            loading={Boolean(loading && settlements)}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Siedlungen suchen' />
          {!loading && !settlements ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <>
              <SettlementsSearchList
                className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}
                searchTerm={searchTerm}
                path='/siedlungen/'
                loading={Boolean(loading && settlements)}
                items={settlements} />
            </>
          )}
        </div>
      </Box>
      <Box className='p-0 md:p-0'>
        <SettlementsMap locationsInput={locationsInput} searchTerm={searchTerm} />
      </Box>
    </>
  );
}
