import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Tag } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

interface AddTagProps {
  getTags: () => Promise<void>
}

export function AddTag({ getTags }: AddTagProps) {
  const [currentTag, setCurrentTag] = useState<Partial<Tag>>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  function setTag(newTag: Partial<Tag>) {
    setCurrentTag({
      ...currentTag,
      ...newTag
    });
  }

  async function submitTag(tag: Partial<Tag>) {
    setLoading(true);
    await fetchData('/api/tags/add', undefined, { method: 'POST', body: JSON.stringify(tag) });
    await getTags();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost placeholder='Neuer Tag' value={currentTag.name} onChange={(event) => setTag({ name: event.target.value })} className='mb-1' />
        </Headline>
      </div>
      <TextareaGhost placeholder='Beschreibung' value={currentTag.description} onChange={(event) => setTag({ description: event.target.value })} />
      <Button disabled={loading} onClick={() => submitTag(currentTag)}>
        <>Tag hinzufügen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
      </Button>
    </>
  );
}