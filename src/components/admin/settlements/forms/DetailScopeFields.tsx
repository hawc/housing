'use client';

import { useId } from 'react';
import {
  detailScopeError,
  DetailScope,
  readDetailScope,
  withDetailScope,
} from '@/lib/detailScope';

export function DetailScopeFields({
  typeName,
  annotation,
  disabled,
  onChange,
}: {
  typeName: string;
  annotation: string;
  disabled?: boolean;
  onChange: (annotation: string) => void;
}) {
  const id = useId();
  const scope = readDetailScope(annotation);
  const error = detailScopeError(typeName, annotation);
  const change = (value: Partial<DetailScope>) =>
    onChange(withDetailScope(annotation, { ...scope, ...value }));
  const inputClass = 'mt-1 w-full border-2 border-highlight bg-transparent p-1';
  return (
    <fieldset disabled={disabled} className='border border-text p-3 space-y-3'>
      <legend>Bezugsgebiet der Statistik</legend>
      <p className='text-sm'>
        Zulässig sind Gesamtangaben zur Siedlung oder belegte, klar abgegrenzte
        Bauabschnitte. Bestände einzelner Eigentümer, Förderprogramme oder
        ausgewählter Häuser reichen dafür nicht aus.
      </p>
      <div>
        <label htmlFor={`${id}-scope`}>Bezugsgebiet</label>
        <select
          id={`${id}-scope`}
          className={inputClass}
          value={scope.scope}
          onChange={(event) =>
            change({ scope: event.target.value as DetailScope['scope'] })
          }
          aria-describedby={`${id}-help`}
        >
          <option value='UNKNOWN'>Bitte prüfen und auswählen</option>
          <option value='SETTLEMENT'>Gesamte Siedlung</option>
          <option value='CONSTRUCTION_PHASE'>
            Klar abgegrenzter Bauabschnitt
          </option>
          <option value='PARTIAL'>
            Sonstiger Teilbestand (nicht zulässig)
          </option>
        </select>
      </div>
      {scope.scope === 'CONSTRUCTION_PHASE' && (
        <>
          <div>
            <label htmlFor={`${id}-phase`}>Name des Bauabschnitts</label>
            <input
              id={`${id}-phase`}
              className={inputClass}
              value={scope.phase}
              maxLength={160}
              onChange={(event) => change({ phase: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor={`${id}-boundary`}>
              Belegte Abgrenzung des Bauabschnitts
            </label>
            <input
              id={`${id}-boundary`}
              className={inputClass}
              value={scope.boundary}
              maxLength={500}
              placeholder='Zum Beispiel benannte Baublöcke oder Straßengrenzen aus der Quelle'
              onChange={(event) => change({ boundary: event.target.value })}
            />
          </div>
        </>
      )}
      <p id={`${id}-help`} className='text-sm'>
        {error ??
          'Die Zuordnung wird in der Anmerkung gespeichert und öffentlich zusammen mit der Zahl angezeigt. Sie muss zum geprüften Quellenbeleg passen.'}
      </p>
    </fieldset>
  );
}
