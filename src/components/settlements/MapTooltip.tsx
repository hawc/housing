interface MapTooltipProps {
  title: string;
}

export function MapTooltip({ title = '' }: MapTooltipProps) {
  return (
    <div
      className='tooltip absolute hidden text-center leading-tight text-white text-sm tracking-wide font-primary whitespace-nowrap'
      dangerouslySetInnerHTML={{ __html: title.replaceAll(', ', '<br />') }}></div>
  );
}