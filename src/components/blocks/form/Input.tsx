import { twMerge } from 'tailwind-merge';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  value?: string | number | undefined;
  type?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  step?: string;
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const removeTimezoneOffset = (date) => new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000);

const formatDate = (date) => new Date(removeTimezoneOffset(date)).toISOString().split('T')[0];

export function InputGhost({ className = '', value = '', name = '', type = 'text', disabled = false, onChange, maxLength = 1000, ...rest }: InputProps) {
  return (
    <input
      className={twMerge(`appearance-none inline-block bg-transparent w-full border-none p-0 ${disabled ? 'opacity-50' : ''} ${className}`)}
      defaultValue={type === 'date' && value ? formatDate(value) : value}
      type={type}
      name={name}
      lang="de-DE"
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
      {...rest} />
  );
}