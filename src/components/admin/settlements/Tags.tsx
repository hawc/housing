import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';

import { Tag } from '@/pages/admin';

function TagItem({ tag, onClick }: { tag: Tag, onClick: (...args: any[]) => void | Promise<void>; }) {
  return (
    <li className="flex mr-1 mb-1 py-0.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full">
      {tag.name}
      <Button ghost className='pl-2' onClick={onClick}><XIcon size={15} /></Button>
    </li>
  );
}

function NewTagItem({ onUpdate }: { onUpdate: (tag: Partial<Tag>) => void | Promise<void> }) {
  const [currentTag, setCurrentTag] = useState<Partial<Tag>>({ name: '', description: '' });
  const [loading, setLoading] = useState<boolean>(false);

  const setTag = (input: Partial<Tag>) => {
    setCurrentTag({
      ...currentTag,
      ...input,
    })
  }

  const updateTag = async (tag: Partial<Tag>) => {
    setLoading(true);
    await onUpdate(tag);
    setLoading(false);
  }


  return (
    <li className="flex mr-1 mb-1 py-0.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full">
      <InputGhost onChange={(event) => setTag({ name: event.target.value })} />
      <Button ghost className='pl-2' onClick={() => updateTag(currentTag)} disabled={loading}><PlusIcon size={15} /></Button>
    </li>
  );
}
export function TagList({ tags, className = '', removeTag, updateTag }: { tags: Tag[], className?: string, removeTag?: (tag: Tag) => void | Promise<void>, updateTag?: (tag: Partial<Tag>) => void | Promise<void> }) {
  return (
    <ul className={`inline-flex ${className}`}>
      {tags.map((tag) => (
        <TagItem onClick={() => removeTag(tag)} key={tag.id} tag={tag} />
      ))}
      <NewTagItem onUpdate={updateTag} />
    </ul>

  );
}