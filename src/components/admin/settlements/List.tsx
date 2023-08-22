'use client';

import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { SearchInput, SettlementsSearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

import { BaseSettlement, Settlement } from '@/app/admin/page';

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [settlements, setSettlements] = useState<Settlement[]>(settlementsInput);
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
        <div className="flex flex-col">
          <SearchInput
            searchTerm={searchTerm}
            loading={Boolean(loading && settlements)}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Siedlungen suchen' />
          {!loading && !settlements ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <SettlementsSearchList
              className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}
              searchTerm={searchTerm}
              path='/admin/siedlungen/'
              loading={Boolean(loading && settlements)}
              items={settlements} />
          )}
        </div>
      </Box>
      <Box>
        <Link arrow href="/admin/siedlungen/neu">Neue Siedlung</Link>
      </Box>
    </>
  );
}
