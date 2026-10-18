/** @jest-environment node */
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));
import type { Prisma } from '@prisma/client';
import prisma from '../prisma';
import {
  saveSettlementPart,
  resourceContent,
  resourceSection,
  touchSettlement,
  updateDay,
} from '../contentUpdates';
import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';
import { SettlementsLogic } from '@/app/api/settlements/SettlementsLogic';
import { ResourcesLogic } from '@/app/api/resources/ResourcesLogic';
import { ExternalLinksLogic } from '@/app/api/externalLinks/ExternalLinksLogic';

function setup() {
  const date = new Date('2020-01-01');
  const owner = {
    id: 's',
    name: 'Siedlung',
    slug: 's',
    description: '',
    published: true,
    updatedAt: date,
    updatedSections: [] as string[],
  };
  const owner2 = { ...owner, id: 's2' };
  const architect = { ...owner, id: 'a' };
  const record = {
    id: 'd',
    settlementId: 's',
    name: 'Einwohnerzahl',
    description: '1200',
    source: 'Amt',
    published: true,
  };
  const resourceType = {
    id: 'photo',
    name: 'Foto',
    description: null,
    published: true,
    createdAt: date,
    updatedAt: date,
  };
  const resource = {
    ...record,
    createdAt: date,
    updatedAt: date,
    url: 'https://example.org',
    license: '',
    copyright: '',
    resourceTypeId: 'photo',
    settlementTypeId: null,
    resourceType,
  };
  const platform = {
    ...resourceType,
    id: 'platform',
    name: 'Plattform',
    slug: 'platform',
    urlIdentifier: null,
    url: null,
  };
  const link: Prisma.ExternalLinksGetPayload<{ include: { platform: true } }> =
    {
      id: 'link',
      name: 'Eigener Linkname',
      description: '',
      url: 'https://example.org',
      published: true,
      architectId: 'a',
      platformId: 'platform',
      platform,
      createdAt: date,
      updatedAt: date,
    };
  const assignment = {
    settlementId: 's',
    architectId: 'a',
    role: 'Planung' as string | null,
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
    resources: {
      findUnique: jest.fn(async () => ({ ...resource })),
      update: jest.fn(async ({ data }) => Object.assign(resource, data)),
    },
    externalLinks: {
      findUnique: jest.fn(async () => ({ ...link })),
      update: jest.fn(async ({ data }) => Object.assign(link, data)),
    },
    settlementsOnArchitects: {
      findMany: jest.fn(async () => [{ architectId: 'a', settlementId: 's' }]),
      findUnique: jest.fn(async () => ({ ...assignment })),
      update: jest.fn(async ({ data }) => Object.assign(assignment, data)),
      delete: jest.fn(async () => ({ ...assignment })),
    },
  };
  const transaction = jest.fn(async (callback) => callback(tx));
  Object.assign(prisma, tx, { $transaction: transaction });
  const content = (row: typeof record) => [
    row.name,
    row.description,
    row.source,
  ];
  const save = (
    after: typeof record,
    section: 'details' | 'history' | 'location' = 'details',
  ) =>
    saveSettlementPart(
      async () => ({ ...record }),
      async () => after,
      section,
      content,
    );
  return {
    owner,
    owner2,
    architect,
    record,
    resource,
    link,
    assignment,
    tx,
    transaction,
    save,
    content,
  };
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-10-18T12:00:00Z'));
});
afterEach(() => jest.useRealTimers());

it.each(['details', 'history', 'location'] as const)(
  'marks %s changes and soft deletions on their settlement',
  async (section) => {
    const f = setup();
    await f.save(
      { ...f.record, description: 'Changed', published: false },
      section,
    );
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
  const save = (after: typeof f.resource) =>
    saveSettlementPart(
      async () => ({ ...f.resource }),
      async () => after,
      resourceSection,
      resourceContent,
    );
  await save({ ...f.resource, published: false });
  expect(f.owner.updatedSections).toEqual(['photos']);
  await save({
    ...f.resource,
    resourceType: { ...f.resource.resourceType, name: 'Website' },
  });
  expect(f.owner.updatedSections).toEqual(['photos', 'links']);
});

it('marks both parents on moves, and ignores timestamp-only/hidden changes', async () => {
  const f = setup();
  await f.save({ ...f.record });
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  f.owner.published = false;
  await f.save({ ...f.record, source: 'Neue Quelle' });
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  f.owner.published = true;
  await f.save({ ...f.record, settlementId: 's2' });
  expect(
    f.tx.settlements.update.mock.calls.map(([args]) => args.where.id),
  ).toEqual(['s', 's2']);
});

it('keeps biography changes on the architect but propagates renames', async () => {
  const f = setup();
  await ArchitectsLogic.updateArchitect(
    { id: 'a' },
    { description: 'Biografie' },
  );
  expect(f.architect.updatedSections).toEqual(['general']);
  expect(f.tx.architects.update).toHaveBeenCalledTimes(1);
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  await ArchitectsLogic.updateArchitect({ id: 'a' }, { name: 'Neuer Name' });
  expect(f.owner.updatedSections).toEqual(['architects']);
});

it.each(['settlement', 'architect'] as const)(
  'skips unchanged %s saves without writing or changing metadata',
  async (kind) => {
    const f = setup();
    const owner = kind === 'settlement' ? f.owner : f.architect;
    const old = { ...owner, updatedSections: [...owner.updatedSections] };
    const result =
      kind === 'settlement'
        ? await SettlementsLogic.updateSettlement(
            { id: 's' },
            { name: { set: owner.name }, description: null },
          )
        : await ArchitectsLogic.updateArchitect(
            { id: 'a' },
            { description: '', published: { set: true } },
          );
    expect(result).toEqual(old);
    expect(f.tx.settlements.update).not.toHaveBeenCalled();
    expect(f.tx.architects.update).not.toHaveBeenCalled();
  },
);

it.each(['settlement', 'architect'] as const)(
  'writes %s content and section metadata exactly once, resetting older sections',
  async (kind) => {
    const f = setup();
    const owner = kind === 'settlement' ? f.owner : f.architect;
    owner.updatedSections = ['photos'];
    const result =
      kind === 'settlement'
        ? await SettlementsLogic.updateSettlement(
            { id: 's' },
            { description: 'New' },
          )
        : await ArchitectsLogic.updateArchitect(
            { id: 'a' },
            { description: { set: 'New' } },
          );
    expect(result).toMatchObject({
      description: 'New',
      updatedAt: new Date(),
      updatedSections: ['general'],
    });
    expect(
      (kind === 'settlement' ? f.tx.settlements : f.tx.architects).update,
    ).toHaveBeenCalledTimes(1);
  },
);

it('preserves supported non-public owner edits without advancing public metadata', async () => {
  const f = setup();
  const previous = f.architect.updatedAt;
  const born = new Date('1900-01-01');
  const result = await ArchitectsLogic.updateArchitect({ id: 'a' }, { born });
  expect(result).toMatchObject({
    born,
    updatedAt: previous,
    updatedSections: [],
  });
  expect(f.tx.architects.update).toHaveBeenCalledTimes(1);
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
});

it('merges current-day sections before an owner write and supports clearing descriptions', async () => {
  const f = setup();
  f.owner.updatedAt = new Date();
  f.owner.updatedSections = ['details'];
  f.owner.description = 'Old';
  await SettlementsLogic.updateSettlement(
    { id: 's' },
    { description: { set: null } },
  );
  expect(f.owner.description).toBeNull();
  expect(f.owner.updatedSections).toEqual(['details', 'general']);
});

it('marks only the settlement for a role-only edit, and neither page for an equivalent empty role', async () => {
  const f = setup();
  const where = {
    settlementId_architectId: { settlementId: 's', architectId: 'a' },
  };
  await ArchitectsLogic.updateSettlementsOnArchitect(where, {
    role: 'Bauleitung',
  });
  expect(f.owner.updatedSections).toEqual(['architects']);
  expect(f.tx.architects.update).not.toHaveBeenCalled();
  f.assignment.role = null;
  f.tx.settlements.update.mockClear();
  await ArchitectsLogic.updateSettlementsOnArchitect(where, { role: '' });
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  expect(f.tx.architects.update).not.toHaveBeenCalled();
});

it('marks both sides of membership changes and unlinks', async () => {
  const f = setup();
  f.tx.settlementsOnArchitects.update.mockImplementationOnce(async () => ({
    ...f.assignment,
    settlementId: 's2',
  }));
  await ArchitectsLogic.updateSettlementsOnArchitect(
    { settlementId_architectId: { settlementId: 's', architectId: 'a' } },
    { settlement: { connect: { id: 's2' } } },
  );
  expect(f.owner.updatedSections).toEqual(['architects']);
  expect(f.owner2.updatedSections).toEqual(['architects']);
  expect(f.architect.updatedSections).toEqual(['settlements']);
  await ArchitectsLogic.removeSettlement('a', 's');
  expect(f.tx.settlementsOnArchitects.delete).toHaveBeenCalledTimes(1);
});

it('ignores non-photo rights changes but records visible photo rights and link sources', async () => {
  const f = setup();
  f.resource.resourceType = { ...f.resource.resourceType, name: 'Website' };
  await ResourcesLogic.updateResource(
    { id: f.resource.id },
    { license: 'CC BY', copyright: 'Name' },
  );
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  await ResourcesLogic.updateResource(
    { id: f.resource.id },
    { source: 'New source' },
  );
  expect(f.owner.updatedSections).toEqual(['links']);
  f.resource.resourceType = { ...f.resource.resourceType, name: 'Foto' };
  await ResourcesLogic.updateResource(
    { id: f.resource.id },
    { copyright: 'Photographer' },
  );
  expect(f.owner.updatedSections).toEqual(['links', 'photos']);
});

it('ignores an overridden link name but records its visible description and URL', async () => {
  const f = setup();
  await ExternalLinksLogic.updateExternalLink(
    { id: 'link' },
    { name: 'Invisible name' },
  );
  expect(f.tx.architects.update).not.toHaveBeenCalled();
  await ExternalLinksLogic.updateExternalLink(
    { id: 'link' },
    { description: 'Visible description', url: 'https://example.org/new' },
  );
  expect(f.architect.updatedSections).toEqual(['links']);
});

it('records a link name when no platform label overrides it', async () => {
  const f = setup();
  f.tx.externalLinks.findUnique.mockImplementationOnce(async () => ({
    ...f.link,
    platform: null,
  }));
  f.tx.externalLinks.update.mockImplementationOnce(async () => ({
    ...f.link,
    name: 'Visible name',
    platform: null,
  }));
  await ExternalLinksLogic.updateExternalLink(
    { id: 'link' },
    { name: 'Visible name' },
  );
  expect(f.architect.updatedSections).toEqual(['links']);
});

it('leaves failed writes untouched and propagates metadata failures to the transaction', async () => {
  const f = setup();
  await expect(
    saveSettlementPart(
      async () => f.record,
      async () => {
        throw new Error('failed write');
      },
      'details',
      f.content,
    ),
  ).rejects.toThrow('failed write');
  expect(f.tx.settlements.update).not.toHaveBeenCalled();
  f.tx.settlements.update.mockRejectedValueOnce(new Error('metadata failed'));
  await expect(f.save({ ...f.record, source: 'New source' })).rejects.toThrow(
    'metadata failed',
  );
});

it.each([
  ['2026-01-01T23:30:00Z', '2026-01-02'],
  ['2026-06-01T22:30:00Z', '2026-06-02'],
  ['2026-03-29T01:00:00Z', '2026-03-29'],
  ['2026-10-25T01:00:00Z', '2026-10-25'],
])('uses Berlin calendar days including DST: %s', (time, day) => {
  expect(updateDay(new Date(time))).toBe(day);
});
