'use client';
import type { Detail } from '@/lib/types';

import { Link } from '@/components/blocks/Link';

interface DetailsListProps extends React.HTMLAttributes<HTMLElement> {
  details: Detail[];
}

function formatDetail(detailText: string, type: string): string {
  switch (type) {
    case 'Fläche (in km²)':
      return `${parseFloat(detailText).toLocaleString('de-DE')} km²`;
    case 'Einwohner*innen':
    case 'Wohneinheiten':
    case 'Gebäudezahl':
      return parseInt(detailText).toLocaleString('de-DE');
    case 'Bauträger':
    default:
      return detailText;
  }
}

function sortByTypeAndDate(a: Detail, b: Detail) {
  return a.detailType.name.localeCompare(b.detailType.name, 'de') || new Date(a.detailDate).getFullYear() - new Date(b.detailDate).getFullYear();
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
          {details.sort(sortByTypeAndDate).map((detail: Detail) => (
            <tr key={detail.id}>
              <td className='pr-4'>{detail.name}{detail.detailDate ? ` (${new Date(detail.detailDate).getFullYear()})` : ''}:</td>
              <td>
                {formatDetail(detail.description, detail.detailType?.name)}{' '}
                {detail.annotation && <>({detail.annotation})</>}{' '}
              </td>
              {detail.source &&
                <td className='pl-4'>
                  {detail.source.includes('http') ? (
                    <Link href={detail.source} title={detail.source}>Quelle</Link>
                  ) : (
                    <>Quelle: {detail.source}</>
                  )}
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}