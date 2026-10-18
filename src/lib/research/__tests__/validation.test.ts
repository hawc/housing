/** @jest-environment node */
import { isAdminSubject, isSameOrigin } from '../../adminAccess';
import {
  canonicalUrl,
  hash,
  parseDraft,
  parseSettlementIds,
  validateDetailValue,
} from '../validation';
import { htmlToText, isPublicIPv4 } from '../sources';
import {
  candidateFingerprint,
  discoveredUrls,
  validateCandidate,
} from '../provider';
import { resolveProposalDraft } from '../proposalDraft';

const typeId = '00000000-0000-4000-8000-000000000001';
const draft = {
  name: 'Wohneinheiten',
  value: '1200',
  typeId,
  annotation: 'Bezugsgebiet: Gesamte Siedlung',
  referenceYear: 2020,
};
const context = {
  name: 'Testsiedlung',
  city: 'Hamburg',
  detailTypes: [{ id: typeId, name: 'Wohneinheiten' }],
  resourceTypes: [],
  existing: {},
};
const source = {
  url: 'https://example.org/siedlung',
  title: 'Quelle',
  text: 'Die Siedlung umfasst insgesamt 1200 Wohnungen.',
  retrievedAt: new Date(),
};

describe('Research boundaries', () => {
  it('fails closed when no admin allowlist is configured', () => {
    const saved = process.env.ADMIN_USER_SUBS;
    delete process.env.ADMIN_USER_SUBS;
    expect(isAdminSubject('auth0|anyone')).toBe(false);
    process.env.ADMIN_USER_SUBS = ' auth0|owner,auth0|editor ';
    expect(isAdminSubject('auth0|owner')).toBe(true);
    expect(isAdminSubject('auth0|stranger')).toBe(false);
    if (saved === undefined) delete process.env.ADMIN_USER_SUBS;
    else process.env.ADMIN_USER_SUBS = saved;
  });

  it('rejects cross-site and missing origins', () => {
    const saved = process.env.APP_BASE_URL;
    process.env.APP_BASE_URL = 'https://grosswohnsiedlungen.de';
    const req = (origin: string | null) =>
      ({
        url: 'https://grosswohnsiedlungen.de/api/research',
        headers: { get: () => origin },
      }) as unknown as Request;
    expect(isSameOrigin(req('https://grosswohnsiedlungen.de'))).toBe(true);
    expect(isSameOrigin(req('https://evil.example'))).toBe(false);
    expect(isSameOrigin(req(null))).toBe(false);
    if (saved === undefined) delete process.env.APP_BASE_URL;
    else process.env.APP_BASE_URL = saved;
  });

  it('only accepts distinct batches of one to five settlements', () => {
    const ids = Array.from(
      { length: 5 },
      (_, index) =>
        `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    );
    for (let count = 1; count <= 5; count++) {
      expect(parseSettlementIds(ids.slice(0, count))).toEqual(
        ids.slice(0, count),
      );
    }
    expect(() => parseSettlementIds([])).toThrow();
    expect(() =>
      parseSettlementIds([...ids, '00000000-0000-4000-8000-000000000005']),
    ).toThrow();
    expect(() => parseSettlementIds(Array(5).fill(typeId))).toThrow();
  });

  it('requires explicit year precision and unambiguous numeric values', () => {
    expect(
      parseDraft({ ...draft, referenceYear: null }).referenceYear,
    ).toBeNull();
    expect(() => parseDraft({ ...draft, referenceYear: undefined })).toThrow();
    expect(() => parseDraft({ ...draft, referenceYear: 9999 })).toThrow();
    expect(() =>
      validateDetailValue({ ...draft, value: '1.200' }, 'Wohneinheiten'),
    ).toThrow();
    expect(() =>
      validateDetailValue({ ...draft, value: '0,7' }, 'Fläche (in km²)'),
    ).toThrow();
    expect(() =>
      validateDetailValue({ ...draft, value: '0.7' }, 'Fläche (in km²)'),
    ).not.toThrow();
  });

  it('hashes JSON independent of database key ordering', () => {
    expect(hash({ a: 1, b: { c: 2, d: 3 } })).toBe(
      hash({ b: { d: 3, c: 2 }, a: 1 }),
    );
    expect(hash({ a: 1 })).not.toBe(hash({ a: 2 }));
  });

  it('validates exact dates and prevents a contradictory year precision', () => {
    expect(
      parseDraft({ ...draft, referenceYear: null, detailDate: '2020-02-29' })
        .detailDate,
    ).toBe('2020-02-29');
    for (const detailDate of ['2021-02-29', '2020-02-30', '2020-01', 'invalid'])
      expect(() =>
        parseDraft({ ...draft, referenceYear: null, detailDate }),
      ).toThrow(/Datum/);
    expect(() => parseDraft({ ...draft, detailDate: '2020-06-15' })).toThrow(
      /entweder/,
    );
  });

  it('fills fields of legacy drafts without inventing a date or license', () => {
    expect(resolveProposalDraft(draft, 'DETAIL', source)).toMatchObject({
      source: source.url,
      detailDate: null,
      referenceYear: 2020,
    });
    expect(
      resolveProposalDraft(
        { ...draft, referenceYear: null },
        'RESOURCE',
        source,
      ),
    ).toMatchObject({
      source: '',
      url: source.url,
      license: '',
      copyright: '',
    });
    expect(
      resolveProposalDraft({ ...draft, source: '' }, 'DETAIL', source).source,
    ).toBe('');
  });

  it('preserves reviewed metadata and allows an empty resource description', () => {
    expect(
      parseDraft(
        {
          ...draft,
          value: '',
          source: 'Statistikamt',
          license: 'CC BY 4.0',
          copyright: 'Stadtarchiv',
        },
        'RESOURCE',
      ),
    ).toMatchObject({
      value: '',
      source: 'Statistikamt',
      license: 'CC BY 4.0',
      copyright: 'Stadtarchiv',
    });
    expect(() => parseDraft({ ...draft, value: '' }, 'DETAIL')).toThrow();
    expect(() =>
      parseDraft({ ...draft, license: 'x'.repeat(1001) }, 'RESOURCE'),
    ).toThrow();
  });

  it('strips active HTML and normalizes German text and entities', () => {
    expect(
      htmlToText(
        '<header>Menu</header><script>ignore me</script><p>Gr&ouml;&szlig;e: 1.200&nbsp;WE</p>',
      ),
    ).toBe('Größe: 1.200 WE');
  });

  it('rejects local and reserved IPv4 destinations', () => {
    for (const address of [
      '127.0.0.1',
      '10.1.2.3',
      '169.254.169.254',
      '172.16.1.1',
      '192.168.1.1',
      '100.100.100.100',
      '0.0.0.0',
      '224.0.0.1',
      '::1',
    ])
      expect(isPublicIPv4(address)).toBe(false);
    expect(isPublicIPv4('8.8.8.8')).toBe(true);
  });

  it('rejects non-HTTPS and credentialed sources and normalizes tracking', () => {
    for (const url of [
      'http://example.org',
      'file:///etc/passwd',
      'https://user:pass@example.org',
      'https://example.org:1234',
    ])
      expect(() => canonicalUrl(url)).toThrow();
    expect(
      canonicalUrl('https://example.org/a?utm_source=test&x=1#title'),
    ).toBe('https://example.org/a?x=1');
  });

  it('only stages verbatim evidence from a retrieved source with a known type', () => {
    const candidate = {
      ...draft,
      kind: 'DETAIL',
      sourceIndex: 0,
      evidence: source.text,
      locator: 'Bestand',
      warnings: '',
    };
    expect(validateCandidate(candidate, context, [source]).draft.value).toBe(
      '1200',
    );
    expect(() =>
      validateCandidate(
        { ...candidate, evidence: 'Dies ist eine erfundene Aussage.' },
        context,
        [source],
      ),
    ).toThrow(/Belegstelle/);
    expect(() =>
      validateCandidate({ ...candidate, sourceIndex: 2 }, context, [source]),
    ).toThrow(/Quelle/);
    expect(() =>
      validateCandidate(
        { ...candidate, typeId: '00000000-0000-4000-8000-000000000099' },
        context,
        [source],
      ),
    ).toThrow(/Typ/);
  });

  it('takes URLs from provider source metadata, never model prose or the archive itself', () => {
    const result = {
      id: 'test',
      status: 'completed',
      output: [
        {
          type: 'web_search_call',
          action: {
            sources: [
              { url: 'https://grosswohnsiedlungen.de/siedlungen/test' },
              { url: 'https://example.org/a' },
            ],
          },
        },
        {
          type: 'message',
          content: [
            {
              type: 'output_text',
              text: 'https://fabricated.example',
              annotations: [
                { type: 'url_citation', url: 'https://example.org/b' },
              ],
            },
          ],
        },
      ],
    };
    expect(discoveredUrls(result)).toEqual([
      'https://example.org/a',
      'https://example.org/b',
    ]);
  });

  it('discards unspecified/partial stocks and requires literal phase boundaries in the source', () => {
    const candidate = {
      ...draft,
      kind: 'DETAIL',
      sourceIndex: 0,
      evidence: source.text,
      locator: 'Bestand',
      warnings: '',
    };
    for (const annotation of [
      '',
      'Bestand der SAGA',
      'Bezugsgebiet: Sonstiger Teilbestand',
    ])
      expect(() =>
        validateCandidate({ ...candidate, annotation }, context, [source]),
      ).toThrow(/Bezugsgebiet|Teilbestände/);
    const phaseSource = {
      ...source,
      text: `${source.text} Bauabschnitt II umfasst die Baublöcke A bis D. Bauabschnitt III umfasst die Baublöcke E bis H.`,
    };
    const annotation =
      'Bezugsgebiet: Klar abgegrenzter Bauabschnitt\nBauabschnitt: Bauabschnitt II\nAbgrenzung: Baublöcke A bis D';
    expect(() =>
      validateCandidate({ ...candidate, annotation }, context, [source]),
    ).toThrow(/wörtlich/);
    const phase = validateCandidate({ ...candidate, annotation }, context, [
      phaseSource,
    ]);
    expect(phase.draft.annotation).toBe(annotation);
    const otherPhase = validateCandidate(
      {
        ...candidate,
        annotation: annotation
          .replace('Bauabschnitt II', 'Bauabschnitt III')
          .replace('Baublöcke A bis D', 'Baublöcke E bis H'),
      },
      context,
      [phaseSource],
    );
    expect(candidateFingerprint('settlement', phase)).not.toBe(
      candidateFingerprint('settlement', otherPhase),
    );
  });
});
