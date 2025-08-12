import { HTMLAttributes, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

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
      className={twMerge(
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

export function Container({
  children,
  className = '',
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <div className={twMerge(`grid grid-cols-1 ${className}`)} {...rest}>
      {children}
    </div>
  );
}
