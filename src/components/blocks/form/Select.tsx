import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Option {
  id: string;
  name: string;
}

interface SelectProps<T> extends React.HTMLAttributes<HTMLSelectElement> {
  value?: string;
  type?: string;
  className?: string;
  onChange?: (event) => void;
  options: (Option & T)[];
}

export function Select<T>({ value = '', className = '', options, onChange = () => { return }, ...rest }: SelectProps<T>) {
  const [currentValue, setCurrentValue] = useState<string>(value);

  const onSelectChange = (event) => {
    setCurrentValue(event.target.value);
    onChange(event);
  }

  return (
    <>
      <select
        value={currentValue}
        onChange={onSelectChange}
        style={{ backgroundPosition: 'right 0.25rem center' }}
        className={twMerge(`appearance-none inline-block bg-transparent w-full border-none p-0 pr-6 text-inherit min-w-fit ${className}`)}
        {...rest}>
        <option value=''></option>
        {options.map(option => (
          <option key={option.id}>{option.name}</option>
        ))}
      </select>
    </>
  );
}