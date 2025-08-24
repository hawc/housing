import { clsxm } from '@/lib/clsxm';
import { ChangeEventHandler, InputHTMLAttributes } from 'react';

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  value?: string;
  name?: string;
  maxLength?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
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
      className={clsxm(
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
