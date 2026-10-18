/** @jest-environment node */
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));
import { reviewProposal } from '../service';

const typeId = '00000000-0000-4000-8000-000000000001';
const original = {
  name: 'Wohneinheiten',
  value: '1200',
  typeId,
  annotation: '',
  referenceYear: 2020,
};

describe('Inventory scope approval boundary', () => {
  const setup = () => {
    const tx = {
      changeProposal: {
        findUnique: jest
          .fn()
          .mockResolvedValue({
            id: 'proposal',
            kind: 'DETAIL',
            status: 'PENDING',
            revision: 1,
            payload: original,
            source: { url: 'https://example.org/settlement', title: 'Quelle' },
            baseline: {
              published: true,
              identity: { name: 'Testsiedlung', city: null, district: null },
              records: [],
            },
          }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      settlements: {
        findUnique: jest
          .fn()
          .mockResolvedValue({
            id: 'settlement',
            name: 'Testsiedlung',
            published: true,
            location: null,
            details: [],
            resources: [],
          }),
        update: jest.fn(),
      },
      detailTypes: {
        findFirst: jest
          .fn()
          .mockResolvedValue({ id: typeId, name: 'Wohneinheiten' }),
      },
      details: { create: jest.fn().mockResolvedValue({ id: 'detail' }) },
      changeLog: { create: jest.fn() },
    };
    const db = {
      $transaction: jest.fn((callback) => callback(tx)),
    } as unknown as NonNullable<Parameters<typeof reviewProposal>[6]>;
    return { db, tx };
  };

  it.each([
    '',
    'Bezugsgebiet: Sonstiger Teilbestand',
    'Bezugsgebiet: Klar abgegrenzter Bauabschnitt\nBauabschnitt: II',
  ])(
    'rejects a direct approval request with an invalid scope',
    async (annotation) => {
      const { db, tx } = setup();
      await expect(
        reviewProposal(
          'proposal',
          1,
          'approve',
          'reviewer',
          { ...original, annotation },
          '',
          db,
        ),
      ).rejects.toThrow(/Bezugsgebiet|Teilbestände|Abgrenzung/);
      expect(tx.details.create).not.toHaveBeenCalled();
      expect(tx.changeLog.create).not.toHaveBeenCalled();
    },
  );

  it('saves the reviewed phase and boundary visibly in the published annotation', async () => {
    const { db, tx } = setup();
    const annotation =
      'Bezugsgebiet: Klar abgegrenzter Bauabschnitt\nBauabschnitt: Bauabschnitt II\nAbgrenzung: Baublöcke A bis D';
    await expect(
      reviewProposal(
        'proposal',
        1,
        'approve',
        'reviewer',
        { ...original, annotation },
        '',
        db,
      ),
    ).resolves.toMatchObject({ status: 'APPLIED' });
    expect(tx.details.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          annotation: `${annotation} · Stand: 2020 (Jahresangabe)`,
        }),
      }),
    );
  });
});
