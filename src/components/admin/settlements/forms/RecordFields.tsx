'use client';

import { useId } from 'react';
import { detailValueError, detailValueKind } from '@/lib/detailValue';
import { DetailScopeFields } from './DetailScopeFields';
import { annotationWithReferenceYear } from '@/lib/detailDateAnnotation';
import {
  DETAIL_FIELDS,
  RESOURCE_FIELDS,
  DetailFormValues,
  ResourceFormValues,
  FieldDefinition,
  TypeOption,
  detailValueInputType,
  requiresDetailDate,
} from '@/lib/settlementFormFields';

type FieldsProps<T> = {
  value: T;
  onChange: (value: T) => void;
  types: TypeOption[];
  disabled?: boolean;
  lockedFields?: (keyof T)[];
};

function RecordFields<T extends Record<string, string>>({
  value,
  onChange,
  types,
  disabled,
  lockedFields = [],
  fields,
  numericValue = false,
  dateRequired = false,
  valueKind,
  valueError,
}: FieldsProps<T> & {
  fields: FieldDefinition<T>[];
  numericValue?: boolean;
  dateRequired?: boolean;
  valueKind?: 'integer' | 'area' | 'text';
  valueError?: string | null;
}) {
  const id = useId();
  return (
    <fieldset disabled={disabled} className='grid gap-3 md:grid-cols-2'>
      {fields.map((field) => {
        const locked = lockedFields.includes(field.key);
        const fieldId = `${id}-${field.key}`;
        const selectedType = types.find((type) => type.id === value[field.key]);
        const className =
          'mt-1 w-full border-2 border-highlight border-solid bg-transparent p-1 disabled:opacity-70';
        return (
          <div key={field.key}>
            <label htmlFor={fieldId} className='block'>
              {field.label}
              {locked && <span className='text-sm'> (festgelegt)</span>}
            </label>
            {field.key === 'annotation' ? (
              <textarea
                id={fieldId}
                className={className}
                rows={4}
                value={value[field.key]}
                maxLength={field.maxLength}
                readOnly={locked}
                onChange={(event) =>
                  onChange({ ...value, [field.key]: event.target.value })
                }
              />
            ) : field.type === 'select' && !locked ? (
              <select
                id={fieldId}
                className={className}
                value={value[field.key]}
                onChange={(event) =>
                  onChange({ ...value, [field.key]: event.target.value })
                }
              >
                <option value=''>Bitte auswählen</option>
                {[...types]
                  .sort((a, b) => a.name.localeCompare(b.name, 'de'))
                  .map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                id={fieldId}
                className={className}
                type={
                  field.type === 'select'
                    ? 'text'
                    : field.key === 'description' && numericValue
                      ? 'number'
                      : (field.type ?? 'text')
                }
                step={
                  field.key === 'description' && numericValue
                    ? valueKind === 'integer'
                      ? '1'
                      : 'any'
                    : undefined
                }
                min={
                  field.key === 'description' && numericValue
                    ? valueKind === 'integer'
                      ? '1'
                      : '0'
                    : undefined
                }
                aria-invalid={
                  field.key === 'description' && value[field.key] && valueError
                    ? true
                    : undefined
                }
                aria-describedby={
                  field.key === 'description' && numericValue
                    ? `${fieldId}-help`
                    : undefined
                }
                value={
                  field.type === 'select'
                    ? (selectedType?.name ?? 'Typ nicht mehr verfügbar')
                    : value[field.key]
                }
                maxLength={field.maxLength}
                required={field.key === 'detailDate' && dateRequired}
                readOnly={locked}
                onChange={(event) =>
                  onChange({ ...value, [field.key]: event.target.value })
                }
              />
            )}
            {field.key === 'description' && numericValue && (
              <p id={`${fieldId}-help`} className='text-sm mt-1'>
                {value[field.key] && valueError
                  ? valueError
                  : valueKind === 'integer'
                    ? 'Positive ganze Zahl ohne Tausendertrennzeichen oder Einheit.'
                    : 'Positive Zahl mit Dezimalpunkt, ohne Einheit. Einheit des Typs beachten.'}
              </p>
            )}
            {field.key === 'detailDate' && dateRequired && (
              <p className='text-sm mt-1'>
                Bezugsdatum erforderlich. Bei einer reinen Jahresangabe den
                31.12. des Jahres eintragen.
              </p>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}

export function DetailFields(props: FieldsProps<DetailFormValues>) {
  const typeName =
    props.types.find((type) => type.id === props.value.detailTypeId)?.name ??
    '';
  return (
    <div className='space-y-3'>
      <RecordFields
        {...props}
        onChange={(value) =>
          props.onChange(
            value.detailDate === props.value.detailDate
              ? value
              : {
                  ...value,
                  annotation: annotationWithReferenceYear(
                    value.annotation,
                    null,
                  ),
                },
          )
        }
        fields={DETAIL_FIELDS}
        numericValue={detailValueInputType(typeName) === 'number'}
        dateRequired={requiresDetailDate(typeName)}
        valueKind={detailValueKind(typeName)}
        valueError={detailValueError(typeName, props.value.description)}
      />
      {detailValueKind(typeName) !== 'text' && (
        <DetailScopeFields
          typeName={typeName}
          annotation={props.value.annotation}
          disabled={props.disabled}
          onChange={(annotation) =>
            props.onChange({ ...props.value, annotation })
          }
        />
      )}
    </div>
  );
}

export function ResourceFields(props: FieldsProps<ResourceFormValues>) {
  const isWebsite = /^(website|webseite)\b/i.test(
    props.types.find((type) => type.id === props.value.resourceTypeId)?.name ??
      '',
  );
  return (
    <div className='space-y-2'>
      <RecordFields {...props} fields={RESOURCE_FIELDS} />
      {isWebsite && (
        <p className='text-sm'>
          Bei Website-Einträgen genügt die URL als Quelle. Das zusätzliche Feld
          „Quelle“ ist optional.
        </p>
      )}
    </div>
  );
}
