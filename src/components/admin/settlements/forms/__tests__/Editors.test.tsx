import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { EditDetail } from '../../details/Edit';
import { EditResource } from '../../resources/Edit';
import { fetchData } from '@/lib/fetch';
import { Event as EditEvent } from '../../timeline/Event';

jest.mock('@/lib/fetch', () => ({ fetchData: jest.fn() }));
jest.mock('@/components/common/form/Upload', () => ({ Upload: () => null }));
jest.mock('@/components/common/LightBox', () => ({ LightBox: () => null }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('Manual editors with shared fields', () => {
  let container: HTMLDivElement;
  let root: Root;
  const fetchMock = fetchData as jest.Mock;
  const field = (labelText: string) => {
    const label = [...container.querySelectorAll('label')].find(
      (label) => label.textContent === labelText,
    )!;
    return document.getElementById(label.htmlFor) as HTMLInputElement;
  };
  async function fill(input: HTMLInputElement, value: string) {
    await act(async () => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )!.set!.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    fetchMock.mockReset();
  });
  it('blocks fractional counts in the manual editor and accepts a corrected count', async () => {
    const detailType = { id: 'type', name: 'Einwohnerzahl', description: '' };
    await act(async () => {
      root.render(
        <EditDetail
          detailInput={{
            id: 'detail',
            name: 'Einwohnerzahl',
            description: '1200',
            annotation: 'Bezugsgebiet: Gesamte Siedlung',
            source: '',
            detailDate: '2020-12-31',
            detailType,
          }}
          availableDetailTypes={[detailType]}
          settlementId='settlement'
          onUpdate={() => {}}
        />,
      );
    });
    await fill(field('Wert'), '1.5');
    expect(container.querySelector('button')).toBeDisabled();
    expect(field('Wert').getAttribute('aria-invalid')).toBe('true');
    await fill(field('Wert'), '1500');
    expect(container.querySelector('button')).not.toBeDisabled();
  });

  it('removes stale generated precision from the visible annotation before saving a changed date', async () => {
    const detailType = { id: 'type', name: 'Einwohnerzahl', description: '' };
    await act(async () => {
      root.render(
        <EditDetail
          detailInput={{
            id: 'detail',
            name: 'Einwohnerzahl',
            description: '1200',
            annotation:
              'Bezugsgebiet: Gesamte Siedlung\nZensus 2020 · Stand: 2020 (Jahresangabe)',
            source: '',
            detailDate: '2020-12-31',
            detailType,
          }}
          availableDetailTypes={[detailType]}
          settlementId='settlement'
          onUpdate={() => {}}
        />,
      );
    });
    await fill(field('Datum'), '2021-12-31');
    expect(field('Anmerkung').value).toBe(
      'Bezugsgebiet: Gesamte Siedlung\nZensus 2020',
    );
    await act(async () => {
      container.querySelector('button')!.click();
    });
    expect(
      JSON.parse(fetchMock.mock.calls[0][2].body).annotation,
    ).not.toContain('Stand: 2020');
  });

  it('saves a corrected event year as the chosen UTC calendar day', async () => {
    const eventType = { id: 'type', name: 'Fertigstellung', description: '' };
    await act(async () => {
      root.render(
        <EditEvent
          eventInput={{
            id: 'event',
            name: 'Fertigstellung südlicher Teil',
            description: '1978',
            source: '',
            eventDate: '1977-12-31',
            eventType,
          }}
          availableEventTypes={[eventType]}
          settlementId='settlement'
          onUpdate={() => {}}
        />,
      );
    });
    const input =
      container.querySelector<HTMLInputElement>('input[type="date"]')!;
    expect(input.value).toBe('1977-12-31');
    await fill(input, '1978-12-31');
    await act(async () => {
      container.querySelector('button')!.click();
    });
    expect(JSON.parse(fetchMock.mock.calls[0][2].body).eventDate).toBe(
      '1978-12-31T00:00:00.000Z',
    );
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('keeps all detail fields controlled and explicitly clears a saved date', async () => {
    const detailType = { id: 'type', name: 'Bauherr', description: '' };
    const detail = {
      id: 'detail',
      name: 'Wohnungen',
      description: '1200',
      annotation: 'Stand des Bestands',
      source: 'Statistikamt',
      detailDate: '2020-06-15T00:00:00.000Z',
      detailType,
    };
    fetchMock.mockResolvedValue({
      ...detail,
      name: 'Gespeicherter Name',
      detailDate: '',
    });
    await act(async () => {
      root.render(
        <EditDetail
          detailInput={detail}
          availableDetailTypes={[detailType]}
          settlementId='settlement'
          onUpdate={() => {}}
        />,
      );
    });
    for (const label of ['Typ', 'Name', 'Wert', 'Anmerkung', 'Datum', 'Quelle'])
      expect(field(label)).not.toBeNull();
    expect(field('Datum').value).toBe('2020-06-15');
    await fill(field('Datum'), '');
    await fill(field('Name'), 'Geprüfter Name');
    await act(async () => {
      container.querySelector('button')!.click();
    });
    const data = JSON.parse(fetchMock.mock.calls[0][2].body);
    expect(data).toMatchObject({
      detailTypeId: 'type',
      name: 'Geprüfter Name',
      description: '1200',
      annotation: 'Stand des Bestands',
      source: 'Statistikamt',
      detailDate: null,
    });
    expect(field('Name').value).toBe('Gespeicherter Name');
    expect(field('Datum').value).toBe('');
  });

  it('persists all resource fields and the currently selected type', async () => {
    const types = [
      { id: 'website', name: 'Website', description: '' },
      { id: 'document', name: 'Dokument', description: '' },
    ];
    fetchMock.mockResolvedValue(undefined);
    await act(async () => {
      root.render(
        <EditResource
          resourceInput={undefined}
          availableResourceTypes={types}
          settlementId='settlement'
          settlementSlug='test'
          onUpdate={() => {}}
        />,
      );
    });
    for (const label of [
      'Typ',
      'Name',
      'Copyright',
      'Quelle',
      'Beschreibung',
      'Lizenz',
      'URL',
    ])
      expect(field(label)).not.toBeNull();
    const type = field('Typ') as unknown as HTMLSelectElement;
    await act(async () => {
      type.value = 'document';
      type.dispatchEvent(new Event('change', { bubbles: true }));
    });
    for (const [label, value] of [
      ['Name', 'Bestandsaufnahme'],
      ['Copyright', 'Stadtarchiv'],
      ['Quelle', 'Statistikamt'],
      ['Beschreibung', 'Jahresbericht'],
      ['Lizenz', 'CC BY 4.0'],
      ['URL', 'https://example.org/bericht'],
    ])
      await fill(field(label), value);
    await act(async () => {
      container.querySelector('button')!.click();
    });
    expect(JSON.parse(fetchMock.mock.calls[0][2].body)).toEqual({
      settlementId: 'settlement',
      resourceTypeId: 'document',
      name: 'Bestandsaufnahme',
      copyright: 'Stadtarchiv',
      source: 'Statistikamt',
      description: 'Jahresbericht',
      license: 'CC BY 4.0',
      url: 'https://example.org/bericht',
    });
  });

  it('blocks a new statistic without a date in the manual editor', async () => {
    const detailType = { id: 'type', name: 'Einwohnerzahl', description: '' };
    await act(async () => {
      root.render(
        <EditDetail
          detailInput={undefined}
          availableDetailTypes={[detailType]}
          settlementId='settlement'
          onUpdate={() => {}}
        />,
      );
    });
    const type = field('Typ') as unknown as HTMLSelectElement;
    await act(async () => {
      type.value = 'type';
      type.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await fill(field('Wert'), '1200');
    expect(field('Datum').required).toBe(true);
    expect(container.querySelector('button')).toBeDisabled();
    await fill(field('Datum'), '2020-12-31');
    const scope = field('Bezugsgebiet') as unknown as HTMLSelectElement;
    await act(async () => {
      scope.value = 'SETTLEMENT';
      scope.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(container.querySelector('button')).not.toBeDisabled();
    await act(async () => {
      container.querySelector('button')!.click();
    });
    expect(JSON.parse(fetchMock.mock.calls[0][2].body).detailDate).toBe(
      '2020-12-31T00:00:00.000Z',
    );
  });
});
