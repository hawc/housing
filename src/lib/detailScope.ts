import { detailValueKind } from './detailValue';

export type DetailScope = {
  scope: 'SETTLEMENT' | 'CONSTRUCTION_PHASE' | 'PARTIAL' | 'UNKNOWN';
  phase: string;
  boundary: string;
};

export class DetailScopeError extends Error {}

// Scope equality is for duplicate detection, not proof that a scope is valid.
// Two unclassified textual details may match; an unclassified legacy statistic
// never matches an explicitly classified settlement or construction phase.
export function sameDetailScope(
  first: string | null | undefined,
  second: string | null | undefined,
): boolean {
  const a = readDetailScope(first);
  const b = readDetailScope(second);
  const normalize = (value: string) =>
    value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('de');
  return (
    a.scope === b.scope &&
    normalize(a.phase) === normalize(b.phase) &&
    normalize(a.boundary) === normalize(b.boundary)
  );
}

// Keep this metadata in the public annotation so no database migration is
// needed and a phase-specific number cannot look like a settlement total.
export function readDetailScope(
  annotation: string | null | undefined,
): DetailScope {
  const lines = (annotation ?? '')
    .split('\n')
    .map((line) => line.split(' · Stand:')[0]);
  const phase =
    lines
      .find((line) => line.startsWith('Bauabschnitt: '))
      ?.slice('Bauabschnitt: '.length) ?? '';
  const boundary =
    lines
      .find((line) => line.startsWith('Abgrenzung: '))
      ?.slice('Abgrenzung: '.length) ?? '';
  const whole = lines.some(
    (line) => line.trim() === 'Bezugsgebiet: Gesamte Siedlung',
  );
  const partial = lines.some(
    (line) => line.trim() === 'Bezugsgebiet: Sonstiger Teilbestand',
  );
  const construction = lines.some(
    (line) => line.trim() === 'Bezugsgebiet: Klar abgegrenzter Bauabschnitt',
  );
  // Conflicting metadata must be resolved by the reviewer, never guessed.
  const scope = partial
    ? 'PARTIAL'
    : whole && (construction || phase || boundary)
      ? 'UNKNOWN'
      : whole
        ? 'SETTLEMENT'
        : construction || phase || boundary
          ? 'CONSTRUCTION_PHASE'
          : 'UNKNOWN';
  return { scope, phase, boundary };
}

export function withDetailScope(
  annotation: string,
  scope: DetailScope,
): string {
  const rest = annotation
    .split('\n')
    .map((line) =>
      /^(?:Bezugsgebiet: (?:Gesamte Siedlung|Sonstiger Teilbestand|Klar abgegrenzter Bauabschnitt)|Bauabschnitt:|Abgrenzung:)/.test(
        line.trim(),
      )
        ? line.includes(' · Stand:')
          ? `Stand:${line.split(' · Stand:').slice(1).join(' · Stand:')}`
          : ''
        : line,
    )
    .filter(Boolean)
    .join('\n')
    .trim();
  const metadata =
    scope.scope === 'SETTLEMENT'
      ? 'Bezugsgebiet: Gesamte Siedlung'
      : scope.scope === 'PARTIAL'
        ? 'Bezugsgebiet: Sonstiger Teilbestand'
        : scope.scope === 'CONSTRUCTION_PHASE'
          ? `Bezugsgebiet: Klar abgegrenzter Bauabschnitt\nBauabschnitt: ${scope.phase}\nAbgrenzung: ${scope.boundary}`
          : '';
  return [metadata, rest].filter(Boolean).join('\n');
}

export function detailScopeError(
  typeName: string,
  annotation: string | null | undefined,
): string | null {
  if (detailValueKind(typeName) === 'text') return null;
  if (annotation != null && typeof annotation !== 'string')
    return 'Ungültige Anmerkung zum Bezugsgebiet.';
  if (annotation && annotation.length > 1000)
    return 'Anmerkung einschließlich Bezugsgebiet bitte auf 1000 Zeichen begrenzen.';
  const { scope, phase, boundary } = readDetailScope(annotation);
  if (scope === 'PARTIAL')
    return 'Teilbestände sind nur für klar abgegrenzte Bauabschnitte zulässig. Reine Eigentümer-, Unternehmens- oder Förderbestände nicht übernehmen.';
  if (scope === 'UNKNOWN')
    return 'Bitte das Bezugsgebiet bestätigen: gesamte Siedlung oder klar abgegrenzter Bauabschnitt. Ungeklärte Teilbestände sind nicht zulässig.';
  if (scope === 'CONSTRUCTION_PHASE' && (!phase.trim() || !boundary.trim()))
    return 'Für einen Bauabschnitt sind Name und eine belegte räumliche oder bauliche Abgrenzung erforderlich. Ein Eigentümername allein genügt nicht.';
  return null;
}

export function validateDetailScope(
  typeName: string,
  annotation: string | null | undefined,
): void {
  const error = detailScopeError(typeName, annotation);
  if (error) throw new DetailScopeError(error);
}
