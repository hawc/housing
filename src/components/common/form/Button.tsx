import { clsxm } from '@/lib/clsxm';
import { Loader2Icon } from 'lucide-react';
import { HTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  ghost?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  className = '',
  type = 'button',
  onClick = () => {},
  disabled = false,
  ghost = false,
  loading = false,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={clsxm(
        `inline-block border-2 border-text ${
          ghost ? '' : 'py-1 px-3 bg-highlight border-highlight'
        } transition-opacity ${isDisabled ? 'opacity-50' : ''} ${className}`
      )}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      {...rest}
    >
      {children}
      {loading && (
        <>
          {' '}
          <Loader2Icon className='inline-block animate-spin align-sub leading-none' />
        </>
      )}
    </button>
  );
}
