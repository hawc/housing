import { clsxm } from '@/lib/clsxm';
import { HTMLAttributes, PropsWithChildren } from 'react';

interface BoxProps extends HTMLAttributes<HTMLElement> {
  ghost?: boolean;
  highlighted?: boolean;
}

export function Box({
  children,
  ghost = false,
  highlighted = false,
  ...rest
}: PropsWithChildren<BoxProps>) {
  const Element = ghost ? 'div' : 'section';

  return (
    <Element
      {...rest}
      className={clsxm(
        `box flex flex-col ${
          ghost
            ? ''
            : `px-3 py-2 md:px-5 md:py-4 border border-text border-solid ${
                highlighted ? 'bg-highlight' : ''
              }`
        } ${rest.className}`
      )}
    >
      {children}
    </Element>
  );
}
