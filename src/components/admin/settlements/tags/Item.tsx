import { Button } from '@/components/common/form/Button';
import { Tag } from '@/lib/types';
import { XIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface TagItemProps {
  tag: Tag;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function TagItem({ tag, onClick }: TagItemProps) {
  return (
    <li className="flex mr-1 mb-1 py-1.5 px-2 italic text-xs font-bold border-2 border-text rounded-full items-center">
      {tag.name}
      <Button ghost className='pl-2 border-0' onClick={onClick}><XIcon size={15} /></Button>
    </li>
  );
}
