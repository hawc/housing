import { PropsWithChildren, useCallback, useState } from 'react';

interface TooltipProps {
  text: string;
}

export function Tooltip({ children, text = '' }: PropsWithChildren<TooltipProps>) {
  const [hasClickedMarker, setHasClickedMarker] = useState(false);

  const handleClick = useCallback(() => {
    if (hasClickedMarker) {
      setHasClickedMarker(false);

      return;
    }
    setHasClickedMarker(true);
    navigator.clipboard.writeText(text);

    const t = setTimeout(() => {
      setHasClickedMarker(false);
    }, 2000);

    return () => {
      clearTimeout(t);
    };
  }, [hasClickedMarker, text]);

  return (
    <span 
      className="relative group md:underline decoration-dashed underline-offset-8 cursor-context-menu"
      onClick={handleClick}>
      {children}<span className="md:hidden">: {text}</span>
      <span aria-hidden className="hidden md:inline-block">
        <span className="absolute break-words left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-bg py-1 px-2 z-10 border border-text w-40 text-sm">
          {hasClickedMarker ? 'In Zwischenablage kopiert' : text}
        </span>
      </span>
    </span>
  );
}