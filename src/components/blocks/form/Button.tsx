import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactElement[] | React.ReactElement | string;
  className?: string;
  ghost?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (...args: any[]) => void | Promise<void>;
}

export function Button({ children, className = '', type = 'button', onClick, disabled = false, ghost = false, ...rest }: ButtonProps) {
  return (
    <>
      <button
        className={twMerge(`inline-block ${ghost ? '' : 'py-1 px-3 bg-highlight'} transition-opacity ${disabled ? 'opacity-50' : ''} ${className}`)}
        type={type}
        onClick={onClick}
        disabled={disabled}
        {...rest}>
        <>{children}</>
      </button>
    </>
  );
}