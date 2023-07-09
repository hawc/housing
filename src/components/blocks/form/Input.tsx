import { twMerge } from 'tailwind-merge';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  value?: string | number | undefined;
  type?: string;
  className?: string;
  onChange: (event) => void;
}

const removeTimezoneOffset = (date) => new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000);

const formatDate = (date) => new Date(removeTimezoneOffset(date)).toISOString().split('T')[0];

export function InputGhost({ className = '', value = '', type = 'text', onChange, ...rest }: InputProps) {
  return (
    <>
      <input
        className={twMerge(`appearance-none inline-block bg-transparent w-full border-none p-0 text-inherit ${className}`)}
        defaultValue={type === 'date' ? formatDate(value) : value}
        type={type}
        onChange={onChange}
        {...rest} />
    </>
  );
}