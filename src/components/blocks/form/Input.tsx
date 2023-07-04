import { twMerge } from 'tailwind-merge';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  value?: string | number | undefined;
  className?: string;
}

export function InputGhost({ className = '', value, ...rest }: InputProps) {
  return (
    <>
      <input className={twMerge(`appearance-none inline-block bg-transparent w-full ${className}`)} value={value} {...rest} />
    </>
  );
}