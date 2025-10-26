'use client';

import { useMemo, useState } from 'react';

import type { BaseLocation, BaseSettlement } from '@/lib/types';
import { useDebounce } from '@/lib/useDebounce';

import { Box } from '@/components/common/Box';
import { SearchInput } from '@/components/common/SearchInput';
import { SettlementsSearchList } from '@/components/common/SearchList';
import { Headline } from '@/components/Headline';
import { SettlementsMap } from '@/components/settlements/SettlementsMap';

const SEARCH_TERM_DEBOUNCE_MS = 800;

interface ListSettlementsProps {
  settlements: BaseSettlement[];
  locations: BaseLocation[];
}

export type Sorting = 'alphabetic' | 'city' | 'state';

export function ListSettlements({
  settlements,
  locations,
}: ListSettlementsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeSorting, setActiveSorting] = useState<Sorting>('alphabetic');

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    [searchTerm],
    SEARCH_TERM_DEBOUNCE_MS
  );

  const Map = useMemo(
    () => (
      <SettlementsMap
        locationsInput={locations}
        searchTerm={debouncedSearchTerm}
      />
    ),
    [debouncedSearchTerm, locations]
  );

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>
            Siedlungen
          </Headline>
        </div>
      </Box>
      <Box className='bg-text text-bg md:py-2'>
        <div className='flex gap-1 md:gap-6 flex-col md:flex-row text-center'>
          <div>Sortieren:</div>
          <button
            onClick={() => setActiveSorting('alphabetic')}
            className={`hover:underline ${
              activeSorting === 'alphabetic' ? 'underline font-semibold' : ''
            }`}
            type='button'
          >
            alphabetisch
          </button>
          <button
            onClick={() => setActiveSorting('city')}
            className={`hover:underline ${
              activeSorting === 'city' ? 'underline font-semibold' : ''
            }`}
            type='button'
          >
            nach Stadt
          </button>
          <button
            onClick={() => setActiveSorting('state')}
            className={`hover:underline ${
              activeSorting === 'state' ? 'underline font-semibold' : ''
            }`}
            type='button'
          >
            nach Bundesland
          </button>
        </div>
      </Box>
      <Box>
        <div className='flex flex-col transition-filter'>
          <SearchInput
            searchTerm={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Siedlungen suchen'
          />
          {!settlements ? (
            <>Keine Siedlungen gefunden.</>
          ) : (
            <SettlementsSearchList
              className='transition-filter'
              searchTerm={searchTerm}
              path='/siedlungen/'
              loading={settlements.length === 0}
              sorting={activeSorting}
              items={settlements}
            />
          )}
        </div>
      </Box>
      <Box className='p-0 md:p-0 overflow-hidden'>{Map}</Box>
    </>
  );
}
