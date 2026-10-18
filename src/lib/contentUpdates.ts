import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { transaction } from './research/transaction';

export const updateSections = {
  general: 'Allgemeines',
  details: 'Details',
  history: 'Historie',
  location: 'Lage',
  architects: 'Architekt*innen',
  photos: 'Fotos',
  links: 'Links und Quellen',
  settlements: 'Siedlungen',
} as const;
export type UpdateSection = keyof typeof updateSections;
type Tx = Prisma.TransactionClient;
type Row = Record<string, unknown>;
type Owner = 'settlements' | 'architects';
const value = (v: unknown) =>
  v == null
    ? ''
    : v instanceof Date
      ? v.toISOString()
      : typeof v === 'object'
        ? JSON.stringify(v)
        : v;
export const hasContentChanges = (
  before: Row | null,
  after: Row | null,
  fields: string[],
) =>
  Boolean(
    (before?.published || after?.published) &&
      (!before ||
        !after ||
        fields.some((field) => value(before[field]) !== value(after[field]))),
  );

export function updateDay(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  return ['year', 'month', 'day']
    .map((type) => parts.find((p) => p.type === type)!.value)
    .join('-');
}

function updateMetadata(
  owner: { updatedAt: Date; updatedSections: string[] },
  sections: UpdateSection[],
) {
  const now = new Date();
  const updatedSections = [
    ...new Set([
      ...(updateDay(owner.updatedAt) === updateDay(now)
        ? owner.updatedSections
        : []),
      ...sections,
    ]),
  ];
  return { updatedAt: now, updatedSections };
}

async function touchOwner(
  tx: Tx,
  model: Owner,
  id: string | null | undefined,
  sections: UpdateSection[],
) {
  if (!id) return;
  // Both delegates share these scalar fields. No history or content snapshots.
  const owner =
    model === 'settlements'
      ? await tx.settlements.findUnique({ where: { id } })
      : await tx.architects.findUnique({ where: { id } });
  if (!owner?.published) return;
  const data = updateMetadata(owner, sections);
  if (model === 'settlements')
    await tx.settlements.update({ where: { id }, data });
  else await tx.architects.update({ where: { id }, data });
}
export const touchSettlement = (
  tx: Tx,
  id: string | null | undefined,
  sections: UpdateSection[],
) => touchOwner(tx, 'settlements', id, sections);
export const touchArchitect = (
  tx: Tx,
  id: string | null | undefined,
  sections: UpdateSection[],
) => touchOwner(tx, 'architects', id, sections);

export async function touchSettlementArchitects(tx: Tx, settlementId: string) {
  const links = await tx.settlementsOnArchitects.findMany({
    where: { settlementId },
    select: { architectId: true },
  });
  for (const link of links)
    await touchArchitect(tx, link.architectId, ['settlements']);
}
export async function touchArchitectSettlements(tx: Tx, architectId: string) {
  const links = await tx.settlementsOnArchitects.findMany({
    where: { architectId },
    select: { settlementId: true },
  });
  for (const link of links)
    await touchSettlement(tx, link.settlementId, ['architects']);
}

type Related =
  | 'details'
  | 'events'
  | 'resources'
  | 'locations'
  | 'externalLinks';
const fields: Record<Related, string[]> = {
  details: [
    'name',
    'description',
    'annotation',
    'source',
    'detailDate',
    'detailTypeId',
    'published',
    'settlementId',
  ],
  events: [
    'name',
    'description',
    'source',
    'eventDate',
    'eventTypeId',
    'published',
    'settlementId',
  ],
  resources: [
    'name',
    'description',
    'url',
    'source',
    'license',
    'copyright',
    'resourceTypeId',
    'published',
    'settlementId',
  ],
  locations: [
    'lat',
    'lng',
    'geo',
    'name',
    'address',
    'district',
    'zipCode',
    'city',
    'state',
    'published',
    'settlementId',
  ],
  externalLinks: [
    'name',
    'description',
    'url',
    'platformId',
    'published',
    'architectId',
  ],
};
const sections: Record<Related, UpdateSection> = {
  details: 'details',
  events: 'history',
  resources: 'links',
  locations: 'location',
  externalLinks: 'links',
};

// Child write and parent timestamp always commit together. Old/new parents are
// retained for moves and soft deletion. Compare scalar public fields, not updatedAt.
export function saveRelated<T extends object>(
  model: Related,
  where: unknown,
  mutate: (tx: Tx) => Promise<T>,
) {
  return transaction(prisma, async (tx) => {
    const reader = tx[model] as unknown as {
      findUnique(args: {
        where: unknown;
        include?: object;
      }): Promise<Row | null>;
    };
    const before = where
      ? await reader.findUnique({
          where,
          ...(model === 'resources' ? { include: { resourceType: true } } : {}),
        })
      : null;
    const result = await mutate(tx);
    const after = result as Row;
    if (!hasContentChanges(before, after, fields[model])) return result;
    if (model === 'externalLinks') {
      for (const id of new Set(
        [before, after]
          .filter((row) => row?.published)
          .map((row) => row!.architectId),
      ))
        await touchArchitect(tx, id as string | null, ['links']);
    } else {
      const changed: UpdateSection[] =
        model === 'resources'
          ? [
              ...new Set(
                [before, after]
                  .filter((row) => row?.published)
                  .map((row) =>
                    (row!.resourceType as { name: string } | undefined)
                      ?.name === 'Foto'
                      ? ('photos' as const)
                      : ('links' as const),
                  ),
              ),
            ]
          : [sections[model]];
      for (const id of new Set(
        [before, after]
          .filter((row) => row?.published)
          .map((row) => row!.settlementId),
      )) {
        await touchSettlement(tx, id as string | null, changed);
        if (model === 'locations' && id)
          await touchSettlementArchitects(tx, id as string);
      }
    }
    return result;
  });
}

export function saveOwner<T extends object>(
  model: Owner,
  where: unknown,
  mutate: (tx: Tx) => Promise<T>,
) {
  return transaction(prisma, async (tx) => {
    const reader = tx[model] as unknown as {
      findUnique(args: { where: unknown }): Promise<Row | null>;
      update(args: object): Promise<unknown>;
    };
    const before = await reader.findUnique({ where });
    const result = await mutate(tx);
    const after = result as Row;
    if (
      hasContentChanges(before, after, [
        'name',
        'slug',
        'description',
        'published',
      ])
    ) {
      const data = after.published
        ? updateMetadata(
            before as unknown as { updatedAt: Date; updatedSections: string[] },
            ['general'],
          )
        : { updatedSections: [] };
      await reader.update({ where: { id: after.id }, data });
      Object.assign(result, data);
      if (
        model === 'architects' &&
        (before?.name !== after.name ||
          before?.slug !== after.slug ||
          before?.published !== after.published)
      )
        await touchArchitectSettlements(tx, after.id as string);
      if (
        model === 'settlements' &&
        (before?.name !== after.name ||
          before?.slug !== after.slug ||
          before?.published !== after.published)
      )
        await touchSettlementArchitects(tx, after.id as string);
    } else if (before) {
      // Prisma bumps updatedAt on a no-op save; preserve the last meaningful update.
      const data = {
        updatedAt: before.updatedAt,
        updatedSections: before.updatedSections,
      };
      await reader.update({ where: { id: after.id }, data });
      Object.assign(result, data);
    }
    return result;
  });
}

export function saveArchitectAssignment<T extends object>(
  where: unknown,
  mutate: (tx: Tx) => Promise<T>,
) {
  return transaction(prisma, async (tx) => {
    const before = where
      ? await tx.settlementsOnArchitects.findUnique({
          where: where as Prisma.SettlementsOnArchitectsWhereUniqueInput,
        })
      : null;
    const after = (await mutate(tx)) as T & {
      settlementId: string;
      architectId: string;
      role?: string | null;
    };
    if (
      !before ||
      before.role !== after.role ||
      before.settlementId !== after.settlementId ||
      before.architectId !== after.architectId
    ) {
      for (const id of new Set([before?.settlementId, after.settlementId]))
        await touchSettlement(tx, id, ['architects']);
      for (const id of new Set([before?.architectId, after.architectId]))
        await touchArchitect(tx, id, ['settlements']);
    }
    return after;
  });
}

export function savePlatform<T extends object>(
  where: Prisma.PlatformsWhereUniqueInput,
  mutate: (tx: Tx) => Promise<T>,
) {
  return transaction(prisma, async (tx) => {
    const before = await tx.platforms.findUnique({ where });
    const result = await mutate(tx);
    const after = result as Row;
    if (before?.name !== after.name) {
      const links = await tx.externalLinks.findMany({
        where: { platformId: after.id as string, published: true },
        select: { architectId: true },
      });
      for (const id of new Set(links.map((link) => link.architectId)))
        await touchArchitect(tx, id, ['links']);
    }
    return result;
  });
}
