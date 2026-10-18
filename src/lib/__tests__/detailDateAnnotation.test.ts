import {
  annotationForDetailDate,
  annotationWithReferenceYear,
} from '../detailDateAnnotation';
import { annotationWithYear } from '../research/proposalDraft';

const note =
  'Bezugsgebiet: Gesamte Siedlung\nZensus 2020 · Stand: 2020 (Jahresangabe)';

describe('Generated reference-year precision notes', () => {
  it('removes a stale year note when changing the date, retaining authored historical context', () => {
    expect(
      annotationForDetailDate(note, '2021-12-31', new Date('2020-12-31')),
    ).toBe('Bezugsgebiet: Gesamte Siedlung\nZensus 2020');
  });

  it('replaces the note for an explicit new year without creating duplicates', () => {
    const annotation = annotationForDetailDate(
      note,
      '2021',
      new Date('2020-12-31'),
    );
    expect(annotation).toBe(
      'Bezugsgebiet: Gesamte Siedlung\nZensus 2020 · Stand: 2021 (Jahresangabe)',
    );
    expect(
      annotationForDetailDate(annotation, '2021', new Date('2021-12-31')),
    ).toBe(annotation);
  });

  it('preserves year precision for unchanged dates and unrelated edits', () => {
    expect(
      annotationForDetailDate(
        note,
        new Date('2020-12-31'),
        new Date('2020-12-31'),
      ),
    ).toBe(note);
  });

  it('removes year-only precision when an exact stichtag is supplied', () => {
    expect(
      annotationForDetailDate(note, '2020-06-15', new Date('2020-12-31')),
    ).not.toContain('Jahresangabe');
    expect(
      annotationForDetailDate(note, null, new Date('2020-12-31')),
    ).not.toContain('Jahresangabe');
  });

  it('handles generated notes on their own line and preserves other date notes', () => {
    expect(
      annotationWithReferenceYear(
        'Stand: 2020 (Jahresangabe)\nQuelle: Zensus 2020\nStand: laut Quelle 2019',
        null,
      ),
    ).toBe('Quelle: Zensus 2020\nStand: laut Quelle 2019');
  });

  it('reconciles pasted notes in research drafts with the approved precision', () => {
    const draft = {
      name: 'Wohnungen',
      value: '1200',
      typeId: 'type',
      annotation: note,
      referenceYear: 2021,
    };
    expect(annotationWithYear(draft)).not.toContain('Stand: 2020');
    expect(annotationWithYear(draft)).toContain('Stand: 2021 (Jahresangabe)');
    expect(
      annotationWithYear({
        ...draft,
        referenceYear: null,
        detailDate: '2020-06-15',
      }),
    ).not.toContain('Jahresangabe');
  });
});
