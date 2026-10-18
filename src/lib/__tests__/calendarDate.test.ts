import { calendarYear, dateInputValue } from '../calendarDate';
import { transformers } from '../transformers';

describe('Calendar dates across timezone boundaries', () => {
  it.each(['1978-01-01', '1984-01-01', '2020-12-31', '2020-06-15'])(
    'preserves %s from database through serialization, editor and year display',
    (day) => {
      const event = transformers.event({
        id: 'event',
        name: 'Fertigstellung',
        description: '',
        source: null,
        eventDate: new Date(`${day}T00:00:00.000Z`),
        eventType: { id: 'type', name: 'Fertigstellung', description: null },
      });
      expect(event.eventDate).toBe(day);
      expect(dateInputValue(event.eventDate)).toBe(day);
      expect(calendarYear(event.eventDate)).toBe(day.slice(0, 4));
      const saved = new Date(
        `${dateInputValue(event.eventDate)}T00:00:00.000Z`,
      );
      expect(saved.toISOString()).toBe(`${day}T00:00:00.000Z`);
    },
  );

  it('does not silently reinterpret the already incorrect Lenzsiedlung timestamps', () => {
    expect(dateInputValue(new Date('1977-12-31T15:00:00.000Z'))).toBe(
      '1977-12-31',
    );
    expect(calendarYear('1983-12-31T15:00:00.000Z')).toBe('1983');
  });

  it('handles legacy calendar strings, empty values and missing dates', () => {
    expect(dateInputValue('Sun Jan 01 1978')).toBe('1978-01-01');
    expect(dateInputValue(null)).toBe('');
    expect(dateInputValue(undefined)).toBe('');
    expect(dateInputValue(new Date('invalid'))).toBe('');
  });
});
