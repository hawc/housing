'use client';

import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { BaseArchitect } from '@/lib/types';

import { Box } from '@/components/common/Box';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/form/Button';
import { SearchInput } from '@/components/common/SearchInput';
import { SearchList } from '@/components/common/SearchList';
import { Headline } from '@/components/Headline';
import { useRouter } from 'next/navigation';

interface ListArchitectsProps {
  architectsInput: BaseArchitect[];
}

export function ListArchitects({ architectsInput }: ListArchitectsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const addArchitect = useCallback(() => {
    router.push('/admin/architekten/neu');
  }, [router]);

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>
            Architekt*innen
          </Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={addArchitect}>
              <PlusIcon className='align-text-bottom' size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Container>
        <Box>
          <div className='flex flex-col transition-filter'>
            <SearchInput
              searchTerm={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Nach Architekt*innen suchen'
            />
            {!architectsInput ? (
              <>Keine Architekt*innen gefunden.</>
            ) : (
              <SearchList
                path='/admin/architekten/'
                searchTerm={searchTerm}
                items={architectsInput}
              />
            )}
          </div>
        </Box>
      </Container>
    </>
  );
}
