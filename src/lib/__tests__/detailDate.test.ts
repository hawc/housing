import { DetailDateError, normalizeDetailDate } from '../detailDate';
import { requiresDetailDate } from '../settlementFormFields';
import { detailDateFromDraft } from '../research/proposalDraft';

describe('Statistical time reference', () => {
  it.each([
    'Einwohner*innen',
    'Einwohnerzahl',
    'Wohneinheiten',
    'Gebäudezahl',
    'Fläche (in km²)',
  ])('requires a date for %s', (type) => {
    expect(requiresDetailDate(type)).toBe(true);
    expect(() => normalizeDetailDate(type, null)).toThrow(DetailDateError);
    expect(() => normalizeDetailDate(type, undefined)).toThrow(/Bezugsdatum/);
  });

  it('maps years to December 31 in manual input and research drafts', () => {
    expect(normalizeDetailDate('Einwohnerzahl', '2020')?.toISOString()).toBe(
      '2020-12-31T00:00:00.000Z',
    );
    expect(
      detailDateFromDraft({
        name: '',
        value: '',
        typeId: '',
        annotation: '',
        referenceYear: 2020,
      }),
    ).toBe('2020-12-31');
  });

  it('preserves a precise date and rejects invalid calendar dates', () => {
    expect(
      normalizeDetailDate('Einwohnerzahl', '2020-06-15')?.toISOString(),
    ).toBe('2020-06-15T00:00:00.000Z');
    expect(
      detailDateFromDraft({
        name: '',
        value: '',
        typeId: '',
        annotation: '',
        referenceYear: null,
        detailDate: '2020-06-15',
      }),
    ).toBe('2020-06-15');
    for (const input of ['2020-02-30', '2021-02-29T00:00:00.000Z', 'invalid'])
      expect(() => normalizeDetailDate('Einwohnerzahl', input)).toThrow(
        DetailDateError,
      );
  });

  it('keeps non-statistical facts optional instead of inventing a reference date', () => {
    expect(normalizeDetailDate('Bauherr', null)).toBeNull();
    expect(
      detailDateFromDraft({
        name: '',
        value: '',
        typeId: '',
        annotation: '',
        referenceYear: null,
      }),
    ).toBeNull();
  });
});
