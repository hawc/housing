'use client';

import { useState } from 'react';

import { Box } from '@/components/blocks/Box';
import { SearchInput, SettlementsSearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';
import { SettlementsMap } from '@/components/settlements/SettlementsMap';

import { BaseLocation, BaseSettlement } from '@/app/admin/page';

export function ListSettlements({ settlements, locations }: { settlements: BaseSettlement[], locations: BaseLocation[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Siedlungen</Headline>
        </div>
      </Box>
      <Box>
        <div className="flex flex-col transition-filter">
          <SearchInput
            searchTerm={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Siedlungen suchen' />
          {!settlements ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <>
              <SettlementsSearchList
                className="transition-filter"
                searchTerm={searchTerm}
                path='/siedlungen/'
                loading={settlements.length === 0}
                items={settlements} />
            </>
          )}
        </div>
      </Box>
      <Box className='p-0 md:p-0'>
        <SettlementsMap locationsInput={locations} searchTerm={searchTerm} />
      </Box>
    </>
  );
}
