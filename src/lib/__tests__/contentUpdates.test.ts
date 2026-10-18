/** @jest-environment node */
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));
import prisma from '../prisma';
import {
  saveRelated,
  saveOwner,
  touchSettlement,
  updateDay,
  touchArchitectSettlements,
} from '../contentUpdates';
import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';

function setup() {
  const owner = {
    id: 's',
    name: 'Siedlung',
    slug: 's',
    description: '',
    published: true,
    updatedAt: new Date('2020-01-01'),
    updatedSections: [] as string[],
  };
  const owner2 = { ...owner, id: 's2' };
  const architect = { ...owner, id: 'a' };
  const record = {
    id: 'd',
    settlementId: 's',
    architectId: 'a',
    name: 'Einwohnerzahl',
    description: '1200',
    source: 'Amt',
    published: true,
  };
  const tx = {
    settlements: {
      findUnique: jest.fn(async ({ where }) => ({
        ...(where.id === 's2' ? owner2 : owner),
      })),
      update: jest.fn(async ({ where, data }) =>
        Object.assign(where.id === 's2' ? owner2 : owner, data),
      ),
    },
    architects: {
      findUnique: jest.fn(async () => ({ ...architect })),
      update: jest.fn(async ({ data }) => Object.assign(architect, data)),
    },
    details: { findUnique: jest.fn(async () => ({ ...record })) },
    events: { findUnique: jest.fn(async () => ({ ...record })) },
    resources: {
      findUnique: jest.fn(async () => ({
        ...record,
        resourceType: { name: 'Foto' },
      })),
    },
    locations: { findUnique: jest.fn(async () => ({ ...record })) },
    externalLinks: { findUnique: jest.fn(async () => ({ ...record })) },
    settlementsOnArchitects: {
      findMany: jest.fn(async () => [{ architectId: 'a', settlementId: 's' }]),
      delete: jest.fn(async () => ({ settlementId: 's', architectId: 'a' })),
    },
  };
  const transaction = jest.fn(async (callback) => callback(tx));
  Object.assign(prisma, tx, { $transaction: transaction });
  return { owner, owner2, architect, record, tx, transaction };
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-10-18T12:00:00Z'));
});
afterEach(() => jest.useRealTimers());

it.each([
  ['details', 'details'],
  ['events', 'history'],
  ['locations', 'location'],
] as const)(
  'marks %s changes and soft deletions on their settlement',
  async (model, section) => {
    const f = setup();
    await saveRelated(model, { id: 'd' }, async () => ({
      ...f.record,
      description: 'Changed',
      published: false,
    }));
    expect(f.owner.updatedSections).toEqual([section]);
    expect(f.owner.updatedAt).toEqual(new Date());
    expect(f.transaction).toHaveBeenCalledTimes(1);
  },
);

it('merges sections during the same day and replaces them on a later day', async () => {
  const f = setup();
  await touchSettlement(f.tx as never, 's', ['details']);
  await touchSettlement(f.tx as never, 's', ['history', 'details']);
  expect(f.owner.updatedSections).toEqual(['details', 'history']);
  jest.setSystemTime(new Date('2026-10-19T12:00:00Z'));
  await touchSettlement(f.tx as never, 's', ['location']);
  expect(f.owner.updatedSections).toEqual(['location']);
});

it('handles photo removal and both categories when a photo becomes a link', async () => {
  const f = setup();
  await saveRelated('resources', { id: 'photo' }, async () => ({
    ...f.record,
    published: false,
    resourceType: { name: 'Foto' },
  }));
  expect(f.owner.updatedSections).toEqual(['photos']);
  await saveRelated('resources', { id: 'photo' }, async () => ({
    ...f.record,
    resourceTypeId: 'website',
    resourceType: { name: 'Website' },
  }));
  expect(f.owner.updatedSections).toEqual(['photos', 'links']);
});

it('marks both parents when a record is moved, and ignores no-op/hidden changes', async () => {
  const f = setup();
  await saveRelated('details', { id: 'd' }, async () => ({
    ...f.record,
    updatedAt: new Date(),
  }));
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  f.owner.published = false;
  await saveRelated('details', { id: 'd' }, async () => ({
    ...f.record,
    source: 'Neue Quelle',
  }));
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  f.owner.published = true;
  await saveRelated('details', { id: 'd' }, async () => ({
    ...f.record,
    settlementId: 's2',
  }));
  expect(
    f.tx.settlements.update.mock.calls.map(([args]) => args.where.id),
  ).toEqual(['s', 's2']);
});

it('keeps biography changes on the architect but propagates renames to settlements', async () => {
  const f = setup();
  await saveOwner('architects', { id: 'a' }, (tx) =>
    tx.architects.update({
      where: { id: 'a' },
      data: { description: 'Biografie' },
    }),
  );
  expect(f.architect.updatedSections).toEqual(['general']);
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  await saveOwner('architects', { id: 'a' }, (tx) =>
    tx.architects.update({ where: { id: 'a' }, data: { name: 'Neuer Name' } }),
  );
  expect(f.owner.updatedSections).toEqual(['architects']);
  await touchArchitectSettlements(f.tx as never, 'a');
  expect(f.owner.updatedSections).toEqual(['architects']);
});

it('preserves meaningful timestamps when a root save changes nothing', async () => {
  const f = setup();
  const old = f.owner.updatedAt;
  await saveOwner('settlements', { id: 's' }, (tx) =>
    tx.settlements.update({
      where: { id: 's' },
      data: { description: '', updatedAt: new Date() },
    }),
  );
  expect(f.owner.updatedAt).toEqual(old);
  expect(f.owner.updatedSections).toEqual([]);
});

it('updates both sides of an unlink and leaves failed writes untouched', async () => {
  const f = setup();
  await ArchitectsLogic.removeSettlement('a', 's');
  expect(f.owner.updatedSections).toEqual(['architects']);
  expect(f.architect.updatedSections).toEqual(['settlements']);
  f.tx.settlements.update.mockClear();
  await expect(
    saveRelated('details', { id: 'd' }, async () => {
      throw new Error('failed write');
    }),
  ).rejects.toThrow('failed write');
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
});

it('propagates metadata failures so the enclosing transaction rolls back', async () => {
  const f = setup();
  f.tx.settlements.update.mockRejectedValueOnce(new Error('metadata failed'));
  await expect(
    saveRelated('details', { id: 'd' }, async () => ({
      ...f.record,
      source: 'Neue Quelle',
    })),
  ).rejects.toThrow('metadata failed');
  expect(f.transaction).toHaveBeenCalledTimes(1);
});

it.each([
  ['2026-01-01T23:30:00Z', '2026-01-02'],
  ['2026-06-01T22:30:00Z', '2026-06-02'],
  ['2026-03-29T01:00:00Z', '2026-03-29'],
  ['2026-10-25T01:00:00Z', '2026-10-25'],
])('uses Berlin calendar days including DST: %s', (time, day) => {
  expect(updateDay(new Date(time))).toBe(day);
});
