import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { SearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

import { BaseArchitect } from '@/pages/admin';

export function ListArchitects({ architectsInput }: { architectsInput: BaseArchitect[] }) {
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
      <Box>
        <div className='flex'>
          <Headline type='h1' className='mb-0 inline-block'>Architekten: Übersicht</Headline>
          <Button className='ml-3 p-2 rounded-full' onClick={() => getArchitects()}>
            <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
          </Button>
        </div>
      </Box>
      <Box>
        <div className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}>
          {!loading && !architects ? (
            <>Keine Architekten gefunden.</>
          ) : (
            <SearchList path='/architekten/' loading={Boolean(loading && architects)} items={architects} />
          )}
        </div>
      </Box>
    </>
  );
}
