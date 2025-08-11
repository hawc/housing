'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { MouseEventHandler, useEffect, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { BaseTag, Tag } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';
import { Select } from '@/components/blocks/form/Select';
import { sortAlphabetically } from '@/utils/sortAlphabetically';

interface TagItemProps {
  tag: Tag;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function TagItem({ tag, onClick }: TagItemProps) {
  return (
    <li className="flex mr-1 mb-1 py-1.5 px-2 italic text-xs font-bold border-2 border-text rounded-full items-center">
      {tag.name}
      <Button ghost className='pl-2 border-0' onClick={onClick}><XIcon size={15} /></Button>
    </li>
  );
}

interface NewTagItemProps {
  availableTags: Tag[];
  onAdd: (tagId: string) => void | Promise<void>;
}

function NewTagItem({ availableTags, onAdd }: NewTagItemProps) {
  const [currentTag, setCurrentTag] = useState<Tag | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  function setTag(id: string) {
    setCurrentTag(availableTags.find(availableTag => availableTag.id === id));
  };

  async function addTag(tagId: string) {
    setLoading(true);
    await onAdd(tagId);
    setLoading(false);
  }

  return (
    <li className="flex mr-1 mb-1 py-1.5 px-2 italic text-xs font-bold border-2 border-text rounded-full items-center">
      <Select<Tag>
        options={availableTags}
        onChange={(event) => {
          if (event.target.value) {
            setTag(event.target.value);
          }
        }}
        className='italic leading-none'
        disabled={loading} />
      <Button
        ghost
        className='pl-2 border-0'
        onClick={() => currentTag && addTag(currentTag.id)}
        disabled={!currentTag?.name || loading}><PlusIcon size={15} /></Button>
    </li>
  );
}

interface TagListProps {
  existingTags: Tag[];
  settlementId: string;
  className?: string;
  getSettlement: () => Promise<void>;
}

export function TagList({ existingTags, settlementId, className = '', getSettlement }: TagListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  async function removeTag(tagId: string) {
    setLoading(true);
    await fetchData(`/api/tags/delete/settlement/${tagId}/${settlementId}`);
    await getSettlement();
    setLoading(false);
  }

  async function addTag(tagId: string, settlementId: string) {
    setLoading(true);
    await fetchData(`/api/settlements/add/tag/${settlementId}/${tagId}`);
    await getSettlement();
    setLoading(false);
  }

  async function getAvailableTags() {
    setLoading(true);
    const tags = await fetchData<BaseTag[], BaseTag[]>('/api/tags/get/all', []);
    if (tags.length > 0) {
      const filteredTags = tags.filter((tag: Tag) => !existingTags.map(existingTag => existingTag.id).includes(tag.id));
      setAvailableTags(filteredTags);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAvailableTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className={`inline-flex ${className}`}>
      {sortAlphabetically(existingTags).map((tag: Tag) => (
        <TagItem onClick={() => removeTag(tag.id)} key={tag.id} tag={tag} />
      ))}
      {!loading && availableTags.length > 0 && (
        <NewTagItem onAdd={(tagId) => addTag(tagId, settlementId)} availableTags={availableTags} />
      )}
    </ul>
  );
}