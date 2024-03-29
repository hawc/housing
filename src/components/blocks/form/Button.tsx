import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  ghost?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (...args: unknown[]) => void | Promise<void>;
}

export function Button({ children, className = '', type = 'button', onClick = () => { return; }, disabled = false, ghost = false, ...rest }: ButtonProps) {
  return (
    <button
      className={twMerge(`inline-block border-2 ${ghost ? '' : 'py-1 px-3 bg-highlight border-highlight'} transition-opacity ${disabled ? 'opacity-50' : ''} ${className}`)}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {children}
    </button>
  );
}