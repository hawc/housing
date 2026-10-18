import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ResearchDashboard } from '../ResearchDashboard';
import type { ProposalDraft } from '@/lib/research/proposalDraft';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const typeId = '00000000-0000-4000-8000-000000000001';
const fixture = () => ({
  configured: true,
  workerOnline: true,
  pendingCount: 1,
  settlements: Array.from({ length: 6 }, (_, index) => ({
    id: `settlement-${index}`,
    name: `Siedlung ${index}`,
    slug: `siedlung-${index}`,
    location: { city: 'Hamburg' },
    _count: { details: index },
  })),
  detailTypes: [{ id: typeId, name: 'Wohneinheiten' }],
  resourceTypes: [{ id: typeId, name: 'Website' }],
  runs: [],
  proposals: [
    {
      id: 'proposal-1',
      settlementId: 'settlement-0',
      revision: 1,
      status: 'PENDING',
      kind: 'DETAIL',
      payload: {
        name: 'Wohneinheiten',
        value: '1200',
        typeId,
        annotation: 'Bezugsgebiet: Gesamte Siedlung',
        referenceYear: 2020,
      } as ProposalDraft,
      baseline: { records: [] as Record<string, unknown>[] },
      evidence: 'Die Siedlung umfasst insgesamt 1200 Wohnungen.',
      locator: 'Abschnitt Bestand',
      warnings: '',
      source: {
        title: 'Kommunale Quelle',
        url: 'https://example.org/siedlung',
        retrievedAt: '2026-10-18T10:00:00Z',
      },
      settlement: { name: 'Siedlung 0', slug: 'siedlung-0' },
      changeLog: null,
    },
  ],
});

describe('Research review interface', () => {
  let container: HTMLDivElement;
  let root: Root;
  let fetchMock: jest.Mock;
  let data: ReturnType<typeof fixture>;
  let outcome: string;
  const button = (text: string) =>
    [...container.querySelectorAll('button')].find((element) =>
      element.textContent?.includes(text),
    )!;
  const render = async () => {
    await act(async () => {
      root.render(<ResearchDashboard />);
    });
  };
  const click = async (element: HTMLElement) => {
    await act(async () => {
      element.click();
    });
  };
  const fill = async (
    input: HTMLInputElement | HTMLTextAreaElement,
    value: string,
  ) => {
    const prototype =
      input.tagName === 'TEXTAREA'
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    await act(async () => {
      Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(
        input,
        value,
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  };
  const field = (labelText: string) => {
    const label = [
      ...container.querySelectorAll<HTMLLabelElement>('label'),
    ].find((label) => label.textContent?.trim().startsWith(labelText))!;
    return (label.querySelector('input') ??
      document.getElementById(label.htmlFor)) as HTMLInputElement;
  };

  beforeEach(() => {
    data = fixture();
    outcome = 'APPLIED';
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    fetchMock = jest.fn(async (_path, options) => ({
      ok: true,
      json: async () =>
        options.method === 'POST' ? { status: outcome } : data,
    }));
    global.fetch = fetchMock;
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it.each([1, 5])(
    'starts an explicitly selected batch of %i settlements',
    async (count) => {
      await render();
      expect(button('Recherche für Auswahl starten')).toBeDisabled();
      if (count === 1) {
        await click(
          container.querySelector<HTMLInputElement>('input[type="checkbox"]')!,
        );
      } else {
        await click(button('Bis zu fünf mit wenigen Details auswählen'));
        expect(
          container.querySelectorAll('input[type="checkbox"]')[5],
        ).toBeDisabled();
      }
      expect(container.textContent).toContain(`${count} von 1–5 ausgewählt`);
      await click(button('Recherche für Auswahl starten'));
      const call = fetchMock.mock.calls.find(
        ([path, options]) =>
          path === '/api/research' && options.method === 'POST',
      );
      expect(JSON.parse(call![1].body).settlementIds).toEqual(
        Array.from({ length: count }, (_, index) => `settlement-${index}`),
      );
    },
  );

  it('shows the source and submits precisely the edited draft and revision', async () => {
    await render();
    expect(container.textContent).toContain(
      'Die Siedlung umfasst insgesamt 1200 Wohnungen.',
    );
    expect(
      container.querySelector('a[href="https://example.org/siedlung"]'),
    ).not.toBeNull();
    const value = field('Wert');
    await fill(value, '1250');
    await click(button('Freigeben & übernehmen'));
    const call = fetchMock.mock.calls.find(
      ([path]) => path === '/api/research/proposals/proposal-1',
    );
    expect(JSON.parse(call![1].body)).toMatchObject({
      action: 'approve',
      revision: 1,
      draft: { value: '1250', referenceYear: 2020, typeId },
    });
    expect(container.textContent).toContain('übernommen und protokolliert');
  });

  it('requires a rejection note and makes stale approvals visible', async () => {
    await render();
    expect(button('Ablehnen')).toBeDisabled();
    const reviewNote = [...container.querySelectorAll('textarea')].find(
      (element) =>
        element.closest('label')?.textContent?.includes('Reviewnotiz'),
    )!;
    await fill(reviewNote, 'Falsche Gebietsgrenze.');
    expect(button('Ablehnen')).not.toBeDisabled();
    outcome = 'STALE';
    await click(button('Freigeben & übernehmen'));
    expect(container.textContent).toContain('Es wurde nichts übernommen');
  });

  it('disables research when the provider is not configured', async () => {
    data.configured = false;
    await render();
    await click(button('Bis zu fünf mit wenigen Details auswählen'));
    expect(button('Recherche für Auswahl starten')).toBeDisabled();
    expect(container.textContent).toContain('OPENAI_API_KEY');
  });

  it('compares every detail field, including dates and sources, separately from the evidence', async () => {
    data.proposals[0].baseline.records = [
      {
        name: 'Bestand 2010',
        description: '1000',
        annotation: 'Ursprünglicher Bestand',
        detailDate: '2010-05-10T00:00:00.000Z',
        source: 'Alte Statistik',
        detailTypeId: typeId,
        published: true,
      },
      {
        name: 'Historische Zählung',
        description: '900',
        annotation: '',
        detailDate: null,
        source: '',
        detailTypeId: typeId,
        published: false,
      },
    ];
    await render();
    const comparison = container.querySelector(
      '[aria-label="Bisher-Neu-Vergleich"]',
    )!;
    for (const text of [
      'Typ',
      'Name',
      'Wert',
      'Anmerkung',
      'Datum',
      'Quelle',
      'Veröffentlichung',
      '10.05.2010',
      'Alte Statistik',
      'Ausgeblendet',
      'Stand: 2020 (Jahresangabe)',
    ])
      expect(comparison.textContent).toContain(text);
    expect(field('Typ').readOnly).toBe(true);
    await fill(field('Quelle'), 'Korrigierte Quellenangabe');
    await fill(field('Datum'), '2020-06-15');
    expect(field('Bezugsjahr').value).toBe('');
    expect(comparison.textContent).toContain('15.06.2020');
    expect(comparison.textContent).not.toContain('Stand: 2020');
    const evidence = container.querySelector('[aria-label="Recherchebelege"]')!;
    expect(evidence.textContent).toContain('Kommunale Quelle');
    expect(evidence.textContent).not.toContain('Korrigierte Quellenangabe');
    expect(evidence.querySelector('input')).toBeNull();
    await click(button('Freigeben & übernehmen'));
    const call = fetchMock.mock.calls.find(([path]) =>
      path.includes('/proposals/'),
    )!;
    expect(JSON.parse(call[1].body).draft).toMatchObject({
      source: 'Korrigierte Quellenangabe',
      detailDate: '2020-06-15',
      referenceYear: null,
    });
  });

  it('shows and submits all resource fields, including edited license and copyright', async () => {
    data.proposals[0].kind = 'RESOURCE';
    data.proposals[0].payload = {
      ...data.proposals[0].payload,
      referenceYear: null,
      source: 'Kommunale Quelle',
    };
    data.proposals[0].baseline.records = [
      {
        resourceTypeId: typeId,
        name: 'Bisherige Quelle',
        description: 'Alte Beschreibung',
        source: 'Alter Herausgeber',
        license: 'Alte Lizenz',
        copyright: 'Altes Copyright',
        url: 'https://example.org/siedlung',
        published: true,
      },
    ];
    await render();
    expect(field('Typ').value).toBe('Website');
    expect(field('URL').readOnly).toBe(true);
    expect(field('Quelle').value).toBe('');
    expect(field('Quelle').required).toBe(false);
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
    expect(container.textContent).toContain('genügt die URL als Quelle');
    expect(field('Lizenz').value).toBe('');
    expect(field('Copyright').value).toBe('');
    const comparison = container.querySelector(
      '[aria-label="Bisher-Neu-Vergleich"]',
    )!;
    for (const text of [
      'Beschreibung',
      'Lizenz',
      'Copyright',
      'Quelle',
      'URL',
      'Alte Lizenz',
      'Altes Copyright',
      'Alter Herausgeber',
      'Nicht angegeben',
    ])
      expect(comparison.textContent).toContain(text);
    await fill(field('Lizenz'), 'CC BY 4.0');
    await fill(field('Copyright'), 'Stadtarchiv');
    await fill(field('Quelle'), 'Statistikamt');
    await fill(field('Beschreibung'), '');
    expect(comparison.textContent).toContain('CC BY 4.0');
    expect(comparison.textContent).toContain('Stadtarchiv');
    await click(button('Freigeben & übernehmen'));
    const call = fetchMock.mock.calls.find(([path]) =>
      path.includes('/proposals/'),
    )!;
    expect(JSON.parse(call[1].body).draft).toMatchObject({
      value: '',
      source: 'Statistikamt',
      url: 'https://example.org/siedlung',
      license: 'CC BY 4.0',
      copyright: 'Stadtarchiv',
    });
  });

  it('uses year end for year-only evidence and keeps its precision when editing other fields', async () => {
    await render();
    expect(field('Datum').value).toBe('2020-12-31');
    expect(field('Quelle').value).toBe('https://example.org/siedlung');
    expect(field('Bezugsjahr').value).toBe('2020');
    await fill(field('Wert'), '1250');
    expect(field('Bezugsjahr').value).toBe('2020');
    expect(
      container.querySelector('[aria-label="Bisher-Neu-Vergleich"]')!
        .textContent,
    ).toContain('31.12.2020');
    await fill(field('Datum'), '2020-06-15');
    await fill(field('Bezugsjahr'), '2021');
    expect(field('Datum').value).toBe('2021-12-31');
    expect(
      container.querySelector('[aria-label="Bisher-Neu-Vergleich"]')!
        .textContent,
    ).toContain('Stand: 2021 (Jahresangabe)');
  });

  it('requires a time reference before a statistical proposal can be approved', async () => {
    data.proposals[0].payload.referenceYear = null;
    await render();
    expect(button('Freigeben & übernehmen')).toBeDisabled();
    await fill(field('Bezugsjahr'), '2020');
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
    expect(field('Datum').value).toBe('2020-12-31');
    await fill(field('Datum'), '');
    expect(field('Bezugsjahr').value).toBe('');
    expect(button('Freigeben & übernehmen')).toBeDisabled();
    await fill(field('Datum'), '2020-06-15');
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
  });

  it('requires an explicit scope for old drafts and complete boundaries for phase stocks', async () => {
    data.proposals[0].payload.annotation = '';
    await render();
    expect(button('Freigeben & übernehmen')).toBeDisabled();
    const scope = container.querySelector<HTMLSelectElement>(
      'select[aria-describedby$="-help"]',
    )!;
    const choose = async (value: string) => {
      await act(async () => {
        scope.value = value;
        scope.dispatchEvent(new Event('change', { bubbles: true }));
      });
    };
    await choose('PARTIAL');
    expect(button('Freigeben & übernehmen')).toBeDisabled();
    expect(container.textContent).toContain('Reine Eigentümer-');
    await choose('CONSTRUCTION_PHASE');
    expect(button('Freigeben & übernehmen')).toBeDisabled();
    await fill(field('Name des Bauabschnitts'), 'Bauabschnitt II');
    await fill(field('Belegte Abgrenzung'), 'Baublöcke A bis D');
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
    const comparison = container.querySelector(
      '[aria-label="Bisher-Neu-Vergleich"]',
    )!;
    expect(comparison.textContent).toContain('Bauabschnitt: Bauabschnitt II');
    expect(comparison.textContent).toContain('Abgrenzung: Baublöcke A bis D');
    const annotation = field('Anmerkung');
    expect(annotation.tagName).toBe('TEXTAREA');
    await fill(annotation, `${annotation.value}\nUngefähre Zahl`);
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
    expect(comparison.textContent).toContain('Ungefähre Zahl');
    await choose('SETTLEMENT');
    expect(comparison.textContent).not.toContain(
      'Bauabschnitt: Bauabschnitt II',
    );
    expect(comparison.textContent).toContain('Bezugsgebiet: Gesamte Siedlung');
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
  });

  it('shows advisory domain checks and updates duplicate/conflict hints when editing', async () => {
    data.proposals[0].baseline.records = [
      { description: '1200', detailDate: '2020-12-31', published: true },
    ];
    await render();
    const hints = container.querySelector(
      '[aria-label="Fachliche Prüfpunkte"]',
    )!;
    for (const text of [
      'Bezugsgebiet',
      'Bestandsart',
      'Genauigkeit',
      'Zeitreihe',
      'Mögliche Dublette',
    ])
      expect(hints.textContent).toContain(text);
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
    await fill(field('Wert'), '1300');
    expect(hints.textContent).toContain(
      'Abweichender Wert zum selben Stichtag',
    );
    expect(hints.textContent).not.toContain('Mögliche Dublette');
    expect(button('Freigeben & übernehmen')).not.toBeDisabled();
    await fill(field('Datum'), '2020-06-15');
    expect(hints.textContent).toContain('Gleiches Bezugsjahr');
    expect(hints.textContent).not.toContain(
      'Abweichender Wert zum selben Stichtag',
    );
    await fill(field('Wert'), '1.5');
    expect(button('Freigeben & übernehmen')).toBeDisabled();
    expect(field('Wert').getAttribute('aria-invalid')).toBe('true');
    expect(container.textContent).toContain('positive ganze Zahl');
  });
});
