import { Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { BaseTag, Tag } from '@/lib/types';

import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { TextareaGhost } from '@/components/common/form/Textarea';
import { Headline } from '@/components/Headline';

interface EditTagProps {
  tag: BaseTag;
  getTags: () => Promise<void>;
}

export function EditTag({ tag, getTags }: EditTagProps) {
  const [currentTag, setCurrentTag] = useState<BaseTag>(tag);
  const [loading, setLoading] = useState<boolean>(false);

  function updateTag(updatedTag: Partial<Tag>) {
    setCurrentTag({
      ...currentTag,
      ...updatedTag,
    });
  }

  async function deleteTag(id: string) {
    setLoading(true);
    await fetchData(`/api/tags/delete/${id}`);
    await getTags();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost
            value={tag.name}
            onChange={(event) => updateTag({ name: event.target.value })}
            className='mb-1'
          />
        </Headline>
        <Button
          disabled={loading}
          onClick={() => deleteTag(tag.id)}
          className='ml-3 p-2 rounded-full'
        >
          {loading ? (
            <Loader2Icon size={15} className='animate-spin' />
          ) : (
            <XIcon size={15} />
          )}
        </Button>
      </div>
      <TextareaGhost
        value={tag.description}
        onChange={(event) => updateTag({ description: event.target.value })}
      />
    </>
  );
}
