/** @jest-environment node */
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));
import { PrismaClient } from '@prisma/client';
import { getUpdates } from '../utils/getUpdates';
import { groupUpdatesByDate } from '../utils/groupUpdatesByDate';
import { mergeAndSortUpdates } from '../utils/mergeAndSortUpdates';

const owner = (id = 's') => ({
  id,
  name: 'Siedlung',
  slug: id,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2026-10-18T12:00:00Z'),
  updatedSections: ['details', 'photos', 'unknown'],
});

it('shows each owner once at its latest update, with known section labels', () => {
  const groups = groupUpdatesByDate([owner()], 'settlement');
  expect(Object.keys(groups)).toEqual(['2026-10-18']);
  expect(groups['2026-10-18']).toHaveLength(1);
  expect(groups['2026-10-18'][0]).toMatchObject({
    changeType: 'updated',
    sections: ['Details', 'Fotos'],
  });
});

it('keeps legacy updates generic and groups creation-day edits correctly in Berlin', () => {
  const groups = groupUpdatesByDate(
    [
      {
        ...owner(),
        createdAt: new Date('2026-06-01T22:30:00Z'),
        updatedAt: new Date('2026-06-02T18:00:00Z'),
        updatedSections: [],
      },
    ],
    'settlement',
  );
  expect(groups['2026-06-02'][0]).toMatchObject({
    changeType: 'created',
    sections: [],
    latestChange: new Date('2026-06-02T18:00:00Z'),
  });
});

it('sorts settlements and architects together by full timestamp, with stable distinct owner keys', () => {
  const settlements = groupUpdatesByDate([owner('s')], 'settlement');
  const architects = groupUpdatesByDate(
    [{ ...owner('a'), updatedAt: new Date('2026-10-18T13:00:00Z') }],
    'architect',
  );
  expect(
    mergeAndSortUpdates(settlements, architects)[0][1].map(
      (update) => update.id,
    ),
  ).toEqual(['a', 's']);
});

it('queries all public owner metadata, without child content or research records', async () => {
  const settlements = jest.fn().mockResolvedValue([owner()]);
  const architects = jest
    .fn()
    .mockResolvedValue([{ ...owner('a'), updatedSections: ['links'] }]);
  const updates = await getUpdates({
    settlements: { findMany: settlements },
    architects: { findMany: architects },
  } as unknown as PrismaClient);
  expect(updates[0][1]).toHaveLength(2);
  for (const query of [settlements, architects]) {
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { published: true },
        orderBy: { updatedAt: 'desc' },
      }),
    );
    expect(query.mock.calls[0][0]).not.toHaveProperty('take');
    expect(JSON.stringify(query.mock.calls)).not.toMatch(
      /include|details|resources|changeProposal|reviewedBy|evidence/,
    );
  }
});

it('retains entries beyond the former 100-per-type cutoff', async () => {
  const settlements = Array.from({ length: 105 }, (_, i) => owner(`s-${i}`));
  const architects = Array.from({ length: 104 }, (_, i) => owner(`a-${i}`));
  const read = (rows: ReturnType<typeof owner>[]) =>
    jest.fn(async ({ take }: { take?: number }) =>
      take === undefined ? rows : rows.slice(0, take),
    );
  const updates = await getUpdates({
    settlements: { findMany: read(settlements) },
    architects: { findMany: read(architects) },
  } as unknown as PrismaClient);
  const entries = updates.flatMap(([, rows]) => rows);
  expect(entries).toHaveLength(209);
  expect(entries.map((row) => row.id)).toEqual(
    expect.arrayContaining(['s-104', 'a-103']),
  );
});
