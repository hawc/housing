import { clsxm } from '@/lib/clsxm';
import { removeTimezoneOffset } from '@/utils/removeTimezoneOffset';
import { ChangeEventHandler, CSSProperties } from 'react';

function formatDate(date: string | number) {
  return new Date(removeTimezoneOffset(date)).toISOString().split('T')[0];
}

interface InputProps {
  id?: string;
  value?: string | number | undefined;
  type?: string;
  placeholder?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  step?: string;
  maxLength?: number;
  style?: CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export function InputGhost({
  id,
  placeholder,
  className = '',
  value = '',
  name = '',
  type = 'text',
  disabled = false,
  maxLength = 1000,
  style,
  onChange,
}: InputProps) {
  return (
    <input
      className={clsxm(
        `appearance-none inline-block bg-transparent w-full border-none p-0 ${
          disabled ? 'opacity-50' : ''
        } ${className}`,
      )}
      defaultValue={type === 'date' && value ? formatDate(value) : value}
      id={id}
      placeholder={placeholder}
      type={type}
      name={name}
      style={style}
      lang='de-DE'
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
}
