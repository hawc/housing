/** @jest-environment node */
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    detailTypes: { findUnique: jest.fn() },
    details: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    $transaction: jest.fn(),
  },
}));
import prisma from '@/lib/prisma';
import { DetailsLogic } from '../DetailsLogic';
import { DetailDateError } from '@/lib/detailDate';

const db = prisma as unknown as {
  detailTypes: { findUnique: jest.Mock };
  details: { create: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  $transaction: jest.Mock;
};
const input = {
  name: 'Einwohnerzahl',
  description: '1200',
  detailTypeId: 'type',
  settlementId: 'settlement',
  annotation: 'Bezugsgebiet: Gesamte Siedlung',
};

describe('Manual detail persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.$transaction.mockImplementation((callback) => callback(db));
    db.detailTypes.findUnique.mockResolvedValue({
      id: 'type',
      name: 'Einwohnerzahl',
    });
    db.details.findUnique.mockResolvedValue({
      ...input,
      id: 'detail',
      detailDate: new Date('2020-12-31T00:00:00.000Z'),
      annotation: input.annotation,
    });
  });

  it('rejects undated statistics at the persistence boundary', async () => {
    await expect(DetailsLogic.addDetail(input)).rejects.toThrow(
      DetailDateError,
    );
    expect(db.details.create).not.toHaveBeenCalled();
  });

  it.each([
    '',
    'Bezugsgebiet: Sonstiger Teilbestand',
    'Bezugsgebiet: Klar abgegrenzter Bauabschnitt\nBauabschnitt: II',
  ])(
    'rejects an unspecified or disallowed stock on both create and update',
    async (annotation) => {
      await expect(
        DetailsLogic.addDetail({ ...input, detailDate: '2020', annotation }),
      ).rejects.toThrow(/Bezugsgebiet|Teilbestände|Abgrenzung/);
      await expect(
        DetailsLogic.updateDetail({ id: 'detail' }, { annotation }),
      ).rejects.toThrow(/Bezugsgebiet|Teilbestände|Abgrenzung/);
      expect(db.details.create).not.toHaveBeenCalled();
      expect(db.details.update).not.toHaveBeenCalled();
    },
  );

  it('persists a year as December 31 and retains its stated precision', async () => {
    await DetailsLogic.addDetail({
      ...input,
      detailDate: '2020',
      annotation: 'Bezugsgebiet: Gesamte Siedlung\nZensus',
    });
    expect(db.details.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          detailDate: new Date('2020-12-31T00:00:00.000Z'),
          annotation:
            'Bezugsgebiet: Gesamte Siedlung\nZensus · Stand: 2020 (Jahresangabe)',
        }),
      }),
    );
  });

  it.each(['1.200', 'ca. 1200', '1.5', '0', '-1'])(
    'rejects invalid numeric values on create and update: %s',
    async (description) => {
      await expect(
        DetailsLogic.addDetail({ ...input, description, detailDate: '2020' }),
      ).rejects.toThrow(/positive ganze Zahl/);
      await expect(
        DetailsLogic.updateDetail({ id: 'detail' }, { description }),
      ).rejects.toThrow(/positive ganze Zahl/);
      expect(db.details.create).not.toHaveBeenCalled();
      expect(db.details.update).not.toHaveBeenCalled();
    },
  );

  it('validates the existing value against a changed detail type', async () => {
    db.details.findUnique.mockResolvedValue({
      ...input,
      description: '0.7',
      detailDate: new Date('2020-12-31'),
      annotation: '',
    });
    await expect(
      DetailsLogic.updateDetail({ id: 'detail' }, { detailTypeId: 'type' }),
    ).rejects.toThrow(/positive ganze Zahl/);
    expect(db.details.update).not.toHaveBeenCalled();
  });

  it('prevents removing a statistical reference date through the old update API', async () => {
    await expect(
      DetailsLogic.updateDetail({ id: 'detail' }, { detailDate: null }),
    ).rejects.toThrow(/Bezugsdatum/);
    expect(db.details.update).not.toHaveBeenCalled();
  });

  it('preserves a precise date during other edits and when explicitly supplied', async () => {
    await DetailsLogic.updateDetail(
      { id: 'detail' },
      { source: 'Statistikamt' },
    );
    expect(db.details.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          detailDate: new Date('2020-12-31T00:00:00.000Z'),
          source: 'Statistikamt',
        }),
      }),
    );
    await DetailsLogic.addDetail({
      ...input,
      detailDate: '2020-06-15T00:00:00.000Z',
    });
    expect(db.details.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          detailDate: new Date('2020-06-15T00:00:00.000Z'),
        }),
      }),
    );
  });

  it('reconciles saved year annotations when changing the date through the update API', async () => {
    const annotation = `${input.annotation}\nZensus 2020 · Stand: 2020 (Jahresangabe)`;
    db.details.findUnique.mockResolvedValue({
      ...input,
      annotation,
      detailDate: new Date('2020-12-31'),
    });
    await DetailsLogic.updateDetail(
      { id: 'detail' },
      { detailDate: '2021-12-31' },
    );
    expect(db.details.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          detailDate: new Date('2021-12-31'),
          annotation: `${input.annotation}\nZensus 2020`,
        }),
      }),
    );
    await DetailsLogic.updateDetail({ id: 'detail' }, { detailDate: '2021' });
    expect(db.details.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          annotation: `${input.annotation}\nZensus 2020 · Stand: 2021 (Jahresangabe)`,
        }),
      }),
    );
    await DetailsLogic.updateDetail(
      { id: 'detail' },
      { source: 'Neue Quelle' },
    );
    expect(db.details.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ annotation }),
      }),
    );
  });
});
