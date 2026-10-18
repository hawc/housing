import { detailValueError, validateDetailValue } from '../detailValue';
import { validateDetailValue as validateResearchValue } from '../research/validation';

describe('Shared detail number validation', () => {
  it.each([
    'Einwohner*innen',
    'Einwohnerzahl',
    'Bewohnerzahl',
    'Wohneinheiten',
    'Wohnungsanzahl',
    'Gebäudezahl',
  ])('uses identical rules in admin and research for %s', (type) => {
    for (const value of ['1200', '1']) {
      expect(() => validateDetailValue(type, value)).not.toThrow();
      expect(() =>
        validateResearchValue(
          { value } as Parameters<typeof validateResearchValue>[0],
          type,
        ),
      ).not.toThrow();
    }
    for (const value of [
      '',
      '1.200',
      '1,200',
      '1200 WE',
      'ca. 1200',
      '1000–1200',
      '1e3',
      '-1',
      '0',
      '1.5',
      '9007199254740992',
    ]) {
      const error = detailValueError(type, value);
      expect(error).not.toBeNull();
      expect(() => validateDetailValue(type, value)).toThrow(error!);
      expect(() =>
        validateResearchValue(
          { value } as Parameters<typeof validateResearchValue>[0],
          type,
        ),
      ).toThrow(error!);
    }
  });

  it('accepts decimal areas but rejects units, commas, overflow and zero', () => {
    for (const value of ['0.7', '9.855', '1'])
      expect(() => validateDetailValue('Fläche (in km²)', value)).not.toThrow();
    for (const value of [
      '',
      '0',
      '-1',
      '0,7',
      '0.7 km²',
      '1e3',
      '9'.repeat(400),
    ])
      expect(() => validateDetailValue('Fläche (in km²)', value)).toThrow();
    expect(() => validateDetailValue('Fläche', null)).toThrow();
  });

  it('keeps textual details unrestricted by numeric rules', () => {
    expect(() => validateDetailValue('Bauherr', 'Neue Heimat')).not.toThrow();
    expect(detailValueError('Gebäudehöhe', '31.5')).toBeNull();
    expect(detailValueError('Einwohnerdichte', '125.5')).toBeNull();
  });
});
