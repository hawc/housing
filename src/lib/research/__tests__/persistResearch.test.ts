/** @jest-environment node */
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));
import { persistResearch, ResearchSettlement } from '../service';
import type { Candidate } from '../provider';

const whole = 'Bezugsgebiet: Gesamte Siedlung';
const phase = (name: string) =>
  `Bezugsgebiet: Klar abgegrenzter Bauabschnitt\nBauabschnitt: ${name}\nAbgrenzung: Baublöcke ${name}`;

describe('Published detail duplicate detection', () => {
  const setup = (annotation: string, date: string | null = '2020-12-31') => {
    const tx = {
      researchJob: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      changeProposal: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      researchSource: { upsert: jest.fn().mockResolvedValue({ id: 'source' }) },
    };
    const db = {
      $transaction: jest.fn((callback) => callback(tx)),
    } as unknown as NonNullable<Parameters<typeof persistResearch>[4]>;
    const settlement = {
      id: 'settlement',
      name: 'Test',
      published: true,
      location: null,
      resources: [],
      details: [
        {
          id: 'existing',
          published: true,
          detailTypeId: 'type',
          description: '1200',
          annotation,
          detailDate: date ? new Date(date) : null,
        },
      ],
    } as unknown as ResearchSettlement;
    const candidate: Candidate = {
      kind: 'DETAIL',
      draft: {
        name: 'Wohneinheiten',
        value: '1200',
        typeId: 'type',
        annotation: whole,
        referenceYear: 2020,
      },
      source: {
        url: 'https://example.org/settlement',
        title: 'Quelle',
        text: 'Die Siedlung umfasst insgesamt 1200 Wohnungen.',
        retrievedAt: new Date(),
      },
      evidence: 'Die Siedlung umfasst insgesamt 1200 Wohnungen.',
      locator: 'Bestand',
      warnings: '',
    };
    return { tx, db, settlement, candidate };
  };

  it.each([
    [phase('I'), phase('II'), 1],
    [whole, phase('II'), 1],
    [phase('II'), whole, 1],
    ['', whole, 1],
    [whole, whole, 0],
    [phase('II'), phase('II'), 0],
    [phase('II'), phase('ii'), 0],
  ])(
    'compares scope before discarding a matching number',
    async (existing, proposed, count) => {
      const { tx, db, settlement, candidate } = setup(existing);
      candidate.draft.annotation = proposed;
      await expect(
        persistResearch(
          'job',
          'lease',
          settlement,
          { candidates: [candidate], notes: '', responseIds: [] },
          db,
        ),
      ).resolves.toBe(count);
      expect(tx.changeProposal.create).toHaveBeenCalledTimes(count);
    },
  );

  it.each([
    ['2020-06-15', '2020-12-31', 1],
    ['2020-06-15', '2020-06-15', 0],
    ['2020-12-31', '2021-12-31', 1],
  ])(
    'compares the actual reference date rather than an unrelated year in the annotation',
    async (existingDate, proposedDate, count) => {
      const { tx, db, settlement, candidate } = setup(
        `${whole}\nPublikation 2021`,
        existingDate,
      );
      candidate.draft.referenceYear = null;
      candidate.draft.detailDate = proposedDate;
      await expect(
        persistResearch(
          'job',
          'lease',
          settlement,
          { candidates: [candidate], notes: '', responseIds: [] },
          db,
        ),
      ).resolves.toBe(count);
      expect(tx.changeProposal.create).toHaveBeenCalledTimes(count);
    },
  );

  it('still suppresses identical undated textual facts', async () => {
    const { tx, db, settlement, candidate } = setup('', null);
    candidate.draft.annotation = '';
    candidate.draft.referenceYear = null;
    await expect(
      persistResearch(
        'job',
        'lease',
        settlement,
        { candidates: [candidate], notes: '', responseIds: [] },
        db,
      ),
    ).resolves.toBe(0);
    expect(tx.changeProposal.create).not.toHaveBeenCalled();
  });
});
