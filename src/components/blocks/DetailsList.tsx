import { Link } from '@/components/blocks/Link';

import { Detail } from '@/app/admin/page';

interface DetailsListProps extends React.HTMLAttributes<HTMLElement> {
  details: Detail[];
}

function formatDetail(detailText: string, type: string): string {
  switch (type) {
    case 'Fläche (in km²)':
      return `${parseFloat(detailText).toLocaleString()} km²`;
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
      <table className='table-auto w-full'>
        <thead className='sr-only'>
          <tr>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail: Detail) => (
            <tr key={detail.id}>
              <td className='pr-4'>{detail.name}{detail.detailDate ? ` (${new Date(detail.detailDate).getFullYear()})` : ''}:</td>
              <td>
                {formatDetail(detail.description, detail.detailType?.name)}{' '}
                {detail.annotation && <>({detail.annotation})</>}{' '}
              </td>
              {detail.source &&
                <td className='pl-4'>
                  <Link href={detail.source} title={detail.source}>Quelle</Link>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}