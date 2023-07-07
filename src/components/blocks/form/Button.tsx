import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactElement[] | React.ReactElement | string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void | Promise<void>;
}

export function Button({ children, className = '', type = 'button', onClick, disabled = false, ...rest }: ButtonProps) {
  return (
    <>
      <button
        className={twMerge(`inline-block bg-highlight py-1 px-3 transition-opacity ${disabled ? 'opacity-50' : ''} ${className}`)}
        type={type}
        onClick={onClick}
        disabled={disabled}
        {...rest}>
        <>{children}</>
      </button>
    </>
  );
}