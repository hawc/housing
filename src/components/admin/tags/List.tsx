'use client';

import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { BaseTag } from '@/lib/types';
import { sortAlphabetically } from '@/lib/utils';

import { AddTag } from '@/components/admin/tags/Add';
import { EditTag } from '@/components/admin/tags/Edit';
import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Headline } from '@/components/Headline';

interface ListTagsProps {
  tagsInput: BaseTag[]
}

export function ListTags({ tagsInput }: ListTagsProps) {
  const [tags, setTags] = useState<BaseTag[]>(tagsInput);
  const [loading, setLoading] = useState(false);

  async function getTags() {
    setLoading(true);
    await fetchData('/api/cache/clear');
    const tags = await fetchData<BaseTag[], BaseTag[]>('/api/tags/get/all', []);
    setTags(tags);
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Tags</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={getTags}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Container className='grid-cols-2'>
        {sortAlphabetically(tags).map((tag: BaseTag) => (
          <Box key={tag.id}>
            <EditTag tag={tag} getTags={getTags} />
          </Box>
        ))}
        <Box>
          <AddTag key={tags.length} getTags={getTags} />
        </Box>
      </Container>
    </>
  );
}
