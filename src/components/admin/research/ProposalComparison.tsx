import {
  DETAIL_FIELDS,
  RESOURCE_FIELDS,
  detailFormValues,
  resourceFormValues,
  TypeOption,
} from '@/lib/settlementFormFields';
import {
  detailValuesFromDraft,
  resourceValuesFromDraft,
  resolveProposalDraft,
  ResolvedProposalDraft,
} from '@/lib/research/proposalDraft';

type PreviousRecord = Parameters<typeof detailFormValues>[0] &
  Parameters<typeof resourceFormValues>[0] & { published?: boolean };

export function ProposalComparison({
  kind,
  baseline,
  draft,
  detailTypes,
  resourceTypes,
  savedDetailDate,
}: {
  kind: 'DETAIL' | 'RESOURCE';
  baseline: unknown;
  draft: ResolvedProposalDraft;
  detailTypes: TypeOption[];
  resourceTypes: TypeOption[];
  savedDetailDate?: string;
}) {
  const records = (baseline as { records?: PreviousRecord[] })?.records ?? [];
  const detail = kind === 'DETAIL';
  const fields = detail ? DETAIL_FIELDS : RESOURCE_FIELDS;
  const types = detail ? detailTypes : resourceTypes;
  const previous = records.map((record) =>
    detail ? detailFormValues(record) : resourceFormValues(record),
  );
  const normalized = resolveProposalDraft(draft, kind, {
    url: draft.url,
    title: draft.source,
  });
  const next = detail
    ? detailValuesFromDraft(normalized, true, savedDetailDate)
    : resourceValuesFromDraft(normalized);

  function display(key: string, value: string) {
    if (!value) return 'Nicht angegeben';
    if (key === 'detailTypeId' || key === 'resourceTypeId')
      return (
        types.find((type) => type.id === value)?.name ??
        'Typ nicht mehr verfügbar'
      );
    if (key === 'detailDate') return value.split('-').reverse().join('.');
    return value;
  }

  return (
    <section aria-label='Bisher-Neu-Vergleich' className='space-y-2'>
      <h4 className='font-semibold'>Bisher–Neu</h4>
      <p className='text-sm'>
        Bisher: Stand bei der Recherche,{' '}
        {detail ? 'gleicher Detailtyp' : 'gleiche URL'}. Neu: die Werte, die bei
        Freigabe gespeichert werden. Der neue Eintrag ergänzt die vorhandenen
        Angaben.
      </p>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-sm'>
          <caption className='sr-only'>
            Vollständiger Vergleich aller Eingabefelder
          </caption>
          <thead>
            <tr>
              <th scope='col' className='border border-text p-2 text-left'>
                Feld
              </th>
              {previous.length ? (
                previous.map((_record, index) => (
                  <th
                    key={index}
                    scope='col'
                    className='border border-text p-2 text-left'
                  >
                    Bisher{previous.length > 1 ? ` ${index + 1}` : ''}
                  </th>
                ))
              ) : (
                <th scope='col' className='border border-text p-2 text-left'>
                  Bisher: kein Eintrag
                </th>
              )}
              <th scope='col' className='border border-text p-2 text-left'>
                Neu (zusätzlicher Eintrag)
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.key}>
                <th
                  scope='row'
                  className='border border-text p-2 text-left align-top'
                >
                  {field.label}
                </th>
                {previous.length ? (
                  previous.map((record, index) => (
                    <td
                      key={index}
                      className='border border-text p-2 align-top whitespace-pre-wrap break-words min-w-40'
                    >
                      {display(
                        field.key,
                        (record as unknown as Record<string, string>)[
                          field.key
                        ],
                      )}
                    </td>
                  ))
                ) : (
                  <td className='border border-text p-2'>—</td>
                )}
                <td className='border border-text p-2 align-top whitespace-pre-wrap break-words min-w-40'>
                  {display(
                    field.key,
                    (next as unknown as Record<string, string>)[field.key],
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <th scope='row' className='border border-text p-2 text-left'>
                Veröffentlichung
              </th>
              {records.length ? (
                records.map((record, index) => (
                  <td key={index} className='border border-text p-2'>
                    {record?.published === false
                      ? 'Ausgeblendet'
                      : 'Veröffentlicht'}
                  </td>
                ))
              ) : (
                <td className='border border-text p-2'>—</td>
              )}
              <td className='border border-text p-2'>Veröffentlicht</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
