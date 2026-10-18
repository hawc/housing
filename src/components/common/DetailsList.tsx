'use client';

import type { Detail } from '@/lib/types';

import { Link } from '@/components/common/Link';
import { Tooltip } from '@/components/common/Tooltip';
import { useMemo } from 'react';
import { calendarYear, dateInputValue } from '@/lib/calendarDate';

interface DetailsListProps {
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
    case 'Bauherr':
    default:
      return detailText;
  }
}

function sortByTypeAndDate(a: Detail, b: Detail) {
  return (
    a.detailType.name.localeCompare(b.detailType.name, 'de') ||
    dateInputValue(a.detailDate).localeCompare(dateInputValue(b.detailDate))
  );
}

export function DetailsList({ details }: DetailsListProps) {
  const sortedDetails = useMemo(() => {
    return [...details].sort(sortByTypeAndDate);
  }, [details]);

  return (
    <div>
      <table className='table-auto w-full'>
        <thead className='sr-only'>
          <tr>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedDetails.map((detail: Detail) => (
            <tr key={detail.id}>
              <td className='pr-4'>
                {detail.name}
                {detail.detailDate
                  ? ` (${calendarYear(detail.detailDate)})`
                  : ''}
                :
              </td>
              <td className='break-all'>
                {formatDetail(detail.description, detail.detailType?.name)}{' '}
                {detail.annotation && <>({detail.annotation})</>}{' '}
              </td>
              {detail.source && (
                <td className='pl-4'>
                  {detail.source.includes('http') ? (
                    <Link
                      href={detail.source}
                      title={detail.source}
                      className='whitespace-nowrap'
                    >
                      Quelle
                    </Link>
                  ) : (
                    <Tooltip text={detail.source}>
                      <span className='whitespace-nowrap'>Quelle</span>
                    </Tooltip>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
