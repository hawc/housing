'use client';

import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { SearchInput, SearchList } from '@/components/blocks/SearchList';
import { Headline } from '@/components/Headline';

import { Architect, BaseArchitect } from '@/app/admin/page';

async function getArchitects() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/all`);
  const architects: BaseArchitect[] = await response.json();

  return architects;
}

export function ListArchitects({ architectsInput }: { architectsInput: BaseArchitect[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [architects, setArchitects] = useState<Architect[]>(architectsInput);
  const [loading, setLoading] = useState(false);

  const reloadArchitects = async () => {
    setLoading(true);
    await fetch(`${process.env.BASE_URL ?? ''}/api/cache/clear`);
    const architects = await getArchitects();
    setArchitects(architects);
    setLoading(false);
  };

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Architekten</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={() => reloadArchitects()}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Container>
        <Box>
          <div className="flex flex-col transition-filter">
            <SearchInput
              searchTerm={searchTerm}
              loading={Boolean(loading && architects)}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Nach Architekten suchen' />
            {!loading && !architects ? (
              <>Keine Architekten gefunden.</>
            ) : (
              <SearchList
                className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}
                path='/admin/architekten/'
                loading={Boolean(loading && architects)}
                searchTerm={searchTerm}
                items={architects} />
            )}
          </div>
        </Box>
        <Box>
          <Link arrow href="/admin/architekten/neu">Neuer Architekt</Link>
        </Box>
      </Container>
    </>
  );
}
