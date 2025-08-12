'use client';

import { sortAlphabetically } from '@/utils/sortAlphabetically';
import { ChangeEventHandler, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Option {
  id: string;
  name: string;
}

interface SelectProps<T> {
  id?: string;
  value?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  options: (Option & T)[];
}

export function Select<T>({
  id,
  value = '',
  className,
  disabled = false,
  options,
  onChange,
}: SelectProps<T>) {
  const [currentValue, setCurrentValue] = useState<string>(value);

  const onSelectChange = (event) => {
    setCurrentValue(event.target.value);
    onChange?.(event);
  };

  return (
    <select
      id={id}
      value={currentValue}
      onChange={onSelectChange}
      disabled={disabled}
      style={{ backgroundPosition: 'right 0.25rem center' }}
      className={twMerge(
        `appearance-none inline-block bg-transparent w-full border-none p-0 pr-6 text-inherit max-w-full ${
          disabled ? 'opacity-50' : ''
        } ${className}`
      )}
    >
      <option value=''>Bitte auswählen</option>
      {options?.length &&
        sortAlphabetically(options).map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
    </select>
  );
}
