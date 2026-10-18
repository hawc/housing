import { detailValueKind } from './detailValue';
import { dateInputValue } from './calendarDate';
export { dateInputValue } from './calendarDate';

export type TypeOption = { id: string; name: string };

export type DetailFormValues = {
  detailTypeId: string;
  name: string;
  description: string;
  annotation: string;
  detailDate: string;
  source: string;
};

export type ResourceFormValues = {
  resourceTypeId: string;
  name: string;
  copyright: string;
  source: string;
  description: string;
  license: string;
  url: string;
};

export type FieldDefinition<T> = {
  key: keyof T & string;
  label: string;
  type?: 'text' | 'date' | 'url' | 'select';
  maxLength?: number;
};

// The editor and comparison use the same field list, labels and order.
export const DETAIL_FIELDS: FieldDefinition<DetailFormValues>[] = [
  { key: 'detailTypeId', label: 'Typ', type: 'select' },
  { key: 'name', label: 'Name', maxLength: 160 },
  { key: 'description', label: 'Wert', maxLength: 2000 },
  { key: 'annotation', label: 'Anmerkung', maxLength: 1000 },
  { key: 'detailDate', label: 'Datum', type: 'date' },
  { key: 'source', label: 'Quelle', maxLength: 2000 },
];

export const RESOURCE_FIELDS: FieldDefinition<ResourceFormValues>[] = [
  { key: 'resourceTypeId', label: 'Typ', type: 'select' },
  { key: 'name', label: 'Name', maxLength: 160 },
  { key: 'copyright', label: 'Copyright', maxLength: 1000 },
  { key: 'source', label: 'Quelle', maxLength: 2000 },
  { key: 'description', label: 'Beschreibung', maxLength: 2000 },
  { key: 'license', label: 'Lizenz', maxLength: 1000 },
  { key: 'url', label: 'URL', type: 'url', maxLength: 2000 },
];

export function detailFormValues(record?: {
  name?: string;
  description?: string | null;
  annotation?: string | null;
  detailDate?: string | Date | null;
  source?: string | null;
  detailTypeId?: string;
  detailType?: TypeOption;
}): DetailFormValues {
  return {
    detailTypeId: record?.detailTypeId ?? record?.detailType?.id ?? '',
    name: record?.name ?? '',
    description: record?.description ?? '',
    annotation: record?.annotation ?? '',
    detailDate: dateInputValue(record?.detailDate),
    source: record?.source ?? '',
  };
}

export function resourceFormValues(record?: {
  name?: string;
  description?: string | null;
  source?: string | null;
  copyright?: string | null;
  license?: string | null;
  url?: string;
  resourceTypeId?: string;
  resourceType?: TypeOption;
}): ResourceFormValues {
  return {
    resourceTypeId: record?.resourceTypeId ?? record?.resourceType?.id ?? '',
    name: record?.name ?? '',
    description: record?.description ?? '',
    copyright: record?.copyright ?? '',
    license: record?.license ?? '',
    source: record?.source ?? '',
    url: record?.url ?? '',
  };
}

export function detailValueInputType(typeName: string) {
  return detailValueKind(typeName) === 'text' ? 'text' : 'number';
}

export function requiresDetailDate(typeName: string) {
  return /Einwohner|Bewohner|Bevölker|Wohneinheit|Wohnungs(?:zahl|anzahl)|Wohnungen|Gebäude|Fläche/i.test(
    typeName,
  );
}
