import { twMerge } from 'tailwind-merge';

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  value?: string;
  name?: string;
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function TextareaGhost({
  className = '',
  value = '',
  name = '',
  onChange,
  maxLength = 5000,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      rows={5}
      className={twMerge(
        `appearance-none inline-block border-none bg-transparent w-full p-0 text-inherit ${className}`
      )}
      defaultValue={value}
      name={name}
      onChange={onChange}
      maxLength={maxLength}
      {...rest}
    />
  );
}
