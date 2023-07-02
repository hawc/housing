
function Tag({ children }: { children: string }) {
  return (
    <li className="inline-block mr-1 mb-1 py-0.5 px-2 italic text-xs font-semibold border-2 border-black rounded-full">
      {children}
    </li>
  );
}

export function TagList({ tagNames, className = '' }: { tagNames: string[], className?: string }) {
  return (
    <ul className={className}>
      {tagNames.map((tagName: string) => (
        <Tag key={tagName}>{tagName}</Tag>
      ))}
    </ul>
  );
}