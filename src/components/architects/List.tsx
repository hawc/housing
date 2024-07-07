'use client';

import { useState } from 'react';

import { BaseArchitect } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import { SearchInput, SearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

export function ListArchitects({ architects }: { architects: BaseArchitect[] }) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Architekt*innen</Headline>
        </div>
      </Box>
      <Box>
        <div className='flex flex-col transition-filter'>
          <SearchInput
            searchTerm={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Architekt*innen suchen' />
          {!architects ? (
            <>Keine Architekt*innen gefunden.</>
          ) : (
            <SearchList
              className='transition-filter'
              path='/architekten/'
              searchTerm={searchTerm}
              items={architects} />
          )}
        </div>
      </Box>
    </>
  );
}
