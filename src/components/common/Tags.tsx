import type { Tag } from '@/lib/types';

interface TagItemProps {
  tag: Tag;
}

function TagItem({ tag }: TagItemProps) {
  return (
    <li className='flex mr-1 mb-1 py-1 px-3 italic text-xs font-semibold border-2 border-text rounded-full'>
      {tag.name}
    </li>
  );
}

interface TagListProps {
  tags: Tag[];
  className?: string;
}

export function TagList({ tags, className = '' }: TagListProps) {
  return (
    <ul className={`inline-flex ${className}`}>
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag}></TagItem>
      ))}
    </ul>
  );
}
