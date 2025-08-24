import { InputGhost } from '@/components/common/form/Input';
import { clsxm } from '@/lib/clsxm';
import { ChangeEventHandler } from 'react';

interface SearchInputProps {
  className?: string;
  searchTerm?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export function SearchInput({
  searchTerm = '',
  placeholder = 'Suchbegriff eingeben',
  onChange,
}: SearchInputProps) {
  return (
    <InputGhost
      placeholder={placeholder}
      value={searchTerm}
      onChange={onChange}
      style={{ outlineOffset: '-2px' }}
      className={clsxm(
        'w-auto -mx-3 -mt-2 md:-mx-5 md:-mt-4 mb-4 px-5 py-4 font-normal border-0 border-b border-text border-solid'
      )}
    />
  );
}
