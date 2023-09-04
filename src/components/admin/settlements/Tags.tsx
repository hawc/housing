'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';
import { sortAlphabetically } from '@/lib/utils';

import { Button } from '@/components/blocks/form/Button';
import { Select } from '@/components/blocks/form/Select';

import { BaseTag, Tag } from '@/app/admin/page';

async function getTags() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/tags/get/all`);
  const tags: BaseTag[] = await response.json();

  return tags;
}

function TagItem({ tag, onClick }: { tag: Tag, onClick: (...args: any[]) => void | Promise<void>; }) {
  return (
    <li className="flex mr-1 mb-1 py-1.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full items-center">
      {tag.name}
      <Button ghost className='pl-2' onClick={onClick}><XIcon size={15} /></Button>
    </li>
  );
}

function NewTagItem({ availableTags, onAdd }: { availableTags: Tag[], onAdd: (tag: Partial<Tag>) => void | Promise<void> }) {
  const [currentTag, setCurrentTag] = useState<Partial<Tag> | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const setTag = (id: string) => {
    setCurrentTag(id ? availableTags.find(availableTag => availableTag.id === id) : undefined);
  }

  const addTag = async (tag: Partial<Tag>) => {
    setLoading(true);
    await onAdd(tag);
    setLoading(false);
  }

  return (
    <li className="flex mr-1 mb-1 py-1.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full items-center">
      <Select<Tag>
        options={availableTags}
        onChange={(e) => setTag(e.target.value)}
        className='italic leading-none'
        disabled={loading} />
      <Button
        ghost
        className='pl-2'
        onClick={() => currentTag && addTag(currentTag)}
        disabled={!currentTag?.name?.length || loading}><PlusIcon size={15} /></Button>
    </li>
  );
}

export function TagList({ existingTags, settlementId, className = '', getSettlement }: { existingTags: Tag[], settlementId: string, className?: string, getSettlement: () => Promise<void> }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const removeTag = async (tag: Tag) => {
    setLoading(true);
    await callAPI({
      type: 'updateTag',
      payload: {
        data: {
          settlements: {
            delete: {
              settlementId_tagId: {
                tagId: tag.id,
                settlementId: settlementId,
              }
            }
          }
        },
        where: { id: tag.id }
      }
    });
    await getSettlement();
    setLoading(false);
  }

  const addTag = async (tag: Tag) => {
    setLoading(true);
    await callAPI({
      type: 'addSettlementOnTag',
      payload: {
        data: {
          tagId: tag.id,
          settlementId: settlementId,
        }
      }
    });
    await getSettlement();
    setLoading(false);
  }

  const getAvailableTags = async () => {
    setLoading(true);
    const tags: BaseTag[] = await getTags();
    if (tags?.length) {
      const filteredTags = tags.filter((tag: Tag) => !existingTags.map(existingTag => existingTag.id).includes(tag.id));
      setAvailableTags(filteredTags ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAvailableTags();
  }, []);

  return (
    <ul className={`inline-flex ${className}`}>
      {sortAlphabetically(existingTags).map((tag: Tag) => (
        <TagItem onClick={() => removeTag(tag)} key={tag.id} tag={tag} />
      ))}
      {!loading && availableTags.length > 0 && (
        <NewTagItem onAdd={addTag} availableTags={availableTags} />
      )}
    </ul>

  );
}