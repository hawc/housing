import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { SearchInput, SearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

import { BaseArchitect } from '@/pages/admin';

export function ListArchitects({ architectsInput }: { architectsInput: BaseArchitect[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [architects, setArchitects] = useState(architectsInput);
  const [loading, setLoading] = useState(false);

  const getArchitects = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const architects = await callAPI({ type: 'getArchitects' });
    setArchitects(architects);
    setLoading(false);
  };

  return (
    <>
      <Box ghost>
        <div className='flex'>
          <Headline type='h1' className='mb-0 inline-block'>Architekten: Übersicht</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={() => getArchitects()}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Box>
        <div className={`flex flex-col transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}>
          <SearchInput
            searchTerm={searchTerm}
            loading={Boolean(loading && architects)}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Nach Architekten suchen' />
          {!loading && !architects ? (
            <>Keine Architekten gefunden.</>
          ) : (
            <SearchList
              path='/architekten/'
              loading={Boolean(loading && architects)}
              searchTerm={searchTerm}
              items={architects} />
          )}
        </div>
      </Box>
    </>
  );
}
