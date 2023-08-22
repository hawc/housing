import { Tag } from '@/app/admin/page';

function TagItem({ tag }: { tag: Tag }) {
  return (
    <li className="flex mr-1 mb-1 py-1 px-3 italic text-xs font-semibold border-2 border-text rounded-full">
      {tag.name}
    </li>
  );
}

export function TagList({ tags, className = '' }: { tags: Tag[], className?: string }) {
  return (
    <ul className={`inline-flex ${className}`}>
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag}></TagItem>
      ))}
    </ul>
  );
}