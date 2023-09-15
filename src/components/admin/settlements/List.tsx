'use client';

import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { SearchInput, SettlementsSearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

import { BaseSettlement, Settlement } from '@/app/admin/page';

async function getSettlements() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', undefined, []);

  return settlements;
}

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [settlements, setSettlements] = useState<Settlement[]>(settlementsInput);
  const [loading, setLoading] = useState(false);

  async function getSettlementsData() {
    setLoading(true);
    await fetch(`${process.env.BASE_URL ?? ''}/api/cache/clear`);
    const settlements = await getSettlements();
    setSettlements(settlements);
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Siedlungen</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={() => getSettlementsData()}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Box>
        <div className="flex flex-col">
          <SearchInput
            searchTerm={searchTerm}
            loading={loading && settlements.length > 0}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Siedlungen suchen' />
          {!loading && !settlements ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <SettlementsSearchList
              className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}
              searchTerm={searchTerm}
              path='/admin/siedlungen/'
              loading={loading && settlements.length > 0}
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
