import { XIcon } from 'lucide-react';

import { Button } from '@/components/blocks/form/Button';

import { Tag } from '@/pages/admin';

function TagItem({ tag, onClick }: { tag: Tag, onClick: (...args: any[]) => void | Promise<void>; }) {
  return (
    <li className="flex mr-1 mb-1 py-0.5 px-2 italic text-xs font-semibold border-2 border-text rounded-full">
      {tag.name}
      <Button ghost className='pl-2' onClick={onClick}><XIcon size={15} /></Button>
    </li>
  );
}

export function TagList({ tags, className = '', removeTag }: { tags: Tag[], className?: string, removeTag?: (tag: Tag) => void | Promise<void> }) {
  return (
    <ul className={`inline-flex ${className}`}>
      {tags.map((tag) => (
        <TagItem onClick={() => removeTag(tag)} key={tag.id} tag={tag} />
      ))}
    </ul>
  );
}