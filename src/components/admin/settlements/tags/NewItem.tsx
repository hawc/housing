'use client';

import { PlusIcon } from 'lucide-react';
import { ChangeEvent, useCallback, useState } from 'react';

import type { Tag } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';
import { Select } from '@/components/blocks/form/Select';

interface NewTagItemProps {
  availableTags: Tag[];
  onAdd: (tagId: string) => void | Promise<void>;
}

export function NewTagItem({ availableTags, onAdd }: NewTagItemProps) {
  const [currentTag, setCurrentTag] = useState<Tag | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeTag = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const selectedTag = availableTags.find(availableTag => availableTag.id === id);

    if (!id || !selectedTag) {
      return;
    }

    setCurrentTag(selectedTag);
  }, [availableTags]);

  const handleAddTag = useCallback(async () => {
    if (!currentTag) {
      return;
    }

    setLoading(true);
    await onAdd(currentTag.id);
    setLoading(false);
  }, [currentTag, onAdd]);

  return (
    <li className="flex mr-1 mb-1 py-1.5 px-2 italic text-xs font-bold border-2 border-text rounded-full items-center">
      <Select<Tag>
        options={availableTags}
        onChange={handleChangeTag}
        className='italic leading-none'
        disabled={loading} />
      <Button
        ghost
        aria-label='Add Tag'
        className='pl-2 border-0'
        onClick={handleAddTag}
        disabled={!currentTag?.name || loading}><PlusIcon size={15} /></Button>
    </li>
  );
}
