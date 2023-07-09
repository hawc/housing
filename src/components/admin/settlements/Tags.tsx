import { PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { Select } from '@/components/blocks/form/Select';

import { Tag } from '@/pages/admin';

function TagItem({ tag, onClick }: { tag: Tag, onClick: (...args: any[]) => void | Promise<void>; }) {
  return (
    <li className="flex mr-1 mb-1 py-0.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full items-center">
      {tag.name}
      <Button ghost className='pl-2' onClick={onClick}><XIcon size={15} /></Button>
    </li>
  );
}

function NewTagItem({ existingTags, onUpdate }: { existingTags: Tag[], onUpdate: (tag: Partial<Tag>) => void | Promise<void> }) {
  const [currentTag, setCurrentTag] = useState<Partial<Tag> | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const setTag = (tagName: string) => {
    setCurrentTag(tagName ? availableTags.find(availableTag => availableTag.name === tagName) : undefined);
  }

  const updateTag = async (tag: Partial<Tag>) => {
    setLoading(true);
    await onUpdate(tag);
    setLoading(false);
  }

  const getAvailableTags = async () => {
    setLoading(true);
    const tags = (await callAPI({ type: 'getTags' })).filter((tag: Tag) => !existingTags.map(existingTag => existingTag.id).includes(tag.id));
    setAvailableTags(tags);
    setLoading(false);
  }

  const addTag = async (tag: Partial<Tag>) => {
    setLoading(true);
    // await onUpdate(tag);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableTags();
  }, []);

  return (
    <li className="flex mr-1 mb-1 py-0.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full items-center">
      <Select<Tag> options={availableTags} onChange={(e) => setTag(e.target.value)} className='italic' disabled={loading} />
      <Button ghost className='pl-2' onClick={() => updateTag(currentTag)} disabled={!currentTag?.name.length || loading}><PlusIcon size={15} /></Button>
    </li>
  );
}

export function TagList({ tags, className = '', removeTag, updateTag }: { tags: Tag[], className?: string, removeTag?: (tag: Tag) => void | Promise<void>, updateTag?: (tag: Partial<Tag>) => void | Promise<void> }) {
  return (
    <ul className={`inline-flex ${className}`}>
      {tags.map((tag) => (
        <TagItem onClick={() => removeTag(tag)} key={tag.id} tag={tag} />
      ))}
      <NewTagItem onUpdate={updateTag} existingTags={tags} />

    </ul>

  );
}