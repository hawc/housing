import { Detail } from '@/pages/admin';

interface DetailsListProps extends React.HTMLAttributes<HTMLElement> {
  details: Detail[];
}

function formatDetail(detailText: string, type: string): string {
  switch (type) {
    case 'Fläche':
      return `${parseFloat(detailText).toLocaleString()}`;
    case 'Einwohner':
    case 'Wohneinheiten':
      return parseInt(detailText).toLocaleString();
    default:
      return detailText;
  }
}

export function DetailsList({ details }: DetailsListProps) {
  return (
    <div>
      {details.map((detail: Detail) => (
        <dl className='grid grid-cols-2' key={detail.id}>
          <dt>{detail.name}:</dt>
          <dd>{formatDetail(detail.description, detail.detailType?.name)} {detail.annotation && <>({detail.annotation})</>}</dd>
        </dl>
      ))}
    </div>
  );
}