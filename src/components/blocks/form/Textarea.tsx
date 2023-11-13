import { twMerge } from 'tailwind-merge';

interface TextareaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  value?: string | number | undefined;
  className?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function TextareaGhost({ className = '', value = '', onChange, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={5}
      className={twMerge(`appearance-none inline-block border-none bg-transparent w-full p-0 text-inherit ${className}`)}
      defaultValue={value}
      onChange={onChange}
      {...rest} />
  );
}