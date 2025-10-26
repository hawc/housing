'use client';

import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Platform } from '@/lib/types';

import { AddPlatform } from '@/components/admin/platforms/Add';
import { EditPlatform } from '@/components/admin/platforms/Edit';
import { Box } from '@/components/common/Box';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/form/Button';
import { Headline } from '@/components/Headline';
import { sortAlphabetically } from '@/utils/sortAlphabetically';

interface ListPlatformsProps {
  platformsInput: Platform[];
}

export function ListPlatforms({ platformsInput }: ListPlatformsProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(platformsInput);
  const [loading, setLoading] = useState(false);

  async function getPlatforms() {
    setLoading(true);
    await fetchData('/api/cache/clear');
    const platforms = await fetchData<Platform[], Platform[]>(
      '/api/platforms/get/all',
      [],
    );
    setPlatforms(platforms);
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>
            Plattformen
          </Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={getPlatforms}>
              <RotateCwIcon
                className={`align-text-bottom ${loading && 'animate-spin'}`}
                size={15}
              />
            </Button>
          </div>
        </div>
      </Box>
      <Container className='grid-cols-2'>
        {sortAlphabetically(platforms).map((platform: Platform) => (
          <Box key={platform.id}>
            <EditPlatform platform={platform} getPlatforms={getPlatforms} />
          </Box>
        ))}
        <Box>
          <AddPlatform key={platforms.length} getPlatforms={getPlatforms} />
        </Box>
      </Container>
    </>
  );
}
