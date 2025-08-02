'use client';

import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { BaseSettlement } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { SearchInput, SettlementsSearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';
import { useRouter } from 'next/navigation';

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[]; }) {
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const addSettlement = useCallback(() => {
    router.push('/admin/siedlungen/neu');
  }, [router]);

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Siedlungen</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={addSettlement}>
              <PlusIcon className='align-text-bottom' size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Box>
        <div className="flex flex-col">
          <SearchInput
            searchTerm={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Siedlungen suchen' />
          {!settlementsInput ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <SettlementsSearchList
              searchTerm={searchTerm}
              path='/admin/siedlungen/'
              items={settlementsInput} />
          )}
        </div>
      </Box>
    </>
  );
}
