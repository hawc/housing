import {
  detailScopeError,
  readDetailScope,
  validateDetailScope,
  withDetailScope,
} from '../detailScope';

describe('Statistical inventory scope', () => {
  it.each([
    'Einwohner*innen',
    'Wohneinheiten',
    'Gebäudezahl',
    'Fläche (in km²)',
  ])('rejects unspecified or partial scope for %s', (type) => {
    for (const annotation of [
      '',
      'Bestand der SAGA',
      'Bezugsgebiet: Sonstiger Teilbestand',
    ])
      expect(() => validateDetailScope(type, annotation)).toThrow();
    expect(() =>
      validateDetailScope(type, 'Bezugsgebiet: Gesamte Siedlung'),
    ).not.toThrow();
  });

  it('requires both phase name and boundary and persists them visibly', () => {
    const input = {
      scope: 'CONSTRUCTION_PHASE' as const,
      phase: '',
      boundary: '',
    };
    let annotation = withDetailScope('Ca. 1200 Wohnungen', input);
    expect(readDetailScope(annotation).scope).toBe('CONSTRUCTION_PHASE');
    expect(detailScopeError('Wohneinheiten', annotation)).toMatch(/Name und/);
    annotation = withDetailScope(annotation, {
      ...input,
      phase: 'Bauabschnitt II',
      boundary: 'Baublöcke A bis D',
    });
    expect(detailScopeError('Wohneinheiten', annotation)).toBeNull();
    expect(annotation).toContain('Bauabschnitt: Bauabschnitt II');
    expect(annotation).toContain('Abgrenzung: Baublöcke A bis D');
    expect(annotation).toContain('Ca. 1200 Wohnungen');
  });

  it('preserves trailing spaces while typing and reference-year precision when changing scope', () => {
    expect(
      readDetailScope(
        withDetailScope('', {
          scope: 'CONSTRUCTION_PHASE',
          phase: 'Bauabschnitt ',
          boundary: '',
        }),
      ).phase,
    ).toBe('Bauabschnitt ');
    const annotation = withDetailScope(
      'Bezugsgebiet: Gesamte Siedlung · Stand: 2020 (Jahresangabe)',
      {
        scope: 'CONSTRUCTION_PHASE',
        phase: 'Bauabschnitt II',
        boundary: 'Baublöcke A bis D',
      },
    );
    expect(annotation).toContain('Stand: 2020 (Jahresangabe)');
    expect(annotation).not.toContain('Bezugsgebiet: Gesamte Siedlung');
  });

  it('rejects conflicting metadata and keeps textual facts optional', () => {
    expect(
      detailScopeError(
        'Wohneinheiten',
        'Bezugsgebiet: Gesamte Siedlung\nBauabschnitt: II\nAbgrenzung: Baublöcke A bis D',
      ),
    ).not.toBeNull();
    expect(detailScopeError('Bauherr', '')).toBeNull();
  });
});
