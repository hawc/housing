import { clsxm } from '@/lib/clsxm';
import { HTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  ghost?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  className = '',
  type = 'button',
  onClick = () => {
    return;
  },
  disabled = false,
  ghost = false,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={clsxm(
        `inline-block border-2 border-text ${
          ghost ? '' : 'py-1 px-3 bg-highlight border-highlight'
        } transition-opacity ${disabled ? 'opacity-50' : ''} ${className}`
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
