import type {
  Details,
  Events,
  Locations,
  Platforms,
  Prisma,
  SettlementsOnArchitects,
} from '@prisma/client';
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
type Owner = {
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  updatedAt: Date;
  updatedSections: string[];
};
type OwnerEdit = Pick<
  Prisma.SettlementsUpdateInput,
  'name' | 'slug' | 'description' | 'published'
>;
type SettlementPart = { settlementId: string | null; published: boolean };
type Resource = Prisma.ResourcesGetPayload<{ include: { resourceType: true } }>;
type ArchitectLink = Prisma.ExternalLinksGetPayload<{
  include: { platform: true };
}>;

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
  owner: Pick<Owner, 'updatedAt' | 'updatedSections'>,
  sections: UpdateSection[],
) {
  const now = new Date();
  return {
    updatedAt: now,
    updatedSections: [
      ...new Set([
        ...(updateDay(owner.updatedAt) === updateDay(now)
          ? owner.updatedSections
          : []),
        ...sections,
      ]),
    ],
  };
}

// Prepare public fields and metadata before the single write. Other supported
// Prisma edits still persist, without advancing the public timestamp.
export function prepareOwnerUpdate<T extends OwnerEdit>(
  owner: Owner,
  input: T,
) {
  const name =
    typeof input.name === 'string'
      ? input.name
      : (input.name?.set ?? owner.name);
  const slug =
    typeof input.slug === 'string'
      ? input.slug
      : (input.slug?.set ?? owner.slug);
  const description =
    input.description === null || typeof input.description === 'string'
      ? input.description
      : input.description?.set !== undefined
        ? input.description.set
        : owner.description;
  const published =
    typeof input.published === 'boolean'
      ? input.published
      : (input.published?.set ?? owner.published);
  const publicChange =
    name !== owner.name ||
    slug !== owner.slug ||
    (description ?? '') !== (owner.description ?? '') ||
    published !== owner.published;
  const additionalEdits = Object.keys(input).some(
    (key) =>
      ![
        'name',
        'slug',
        'description',
        'published',
        'updatedAt',
        'updatedSections',
      ].includes(key),
  );
  if (!publicChange && !additionalEdits) return null;
  if (!publicChange)
    return {
      ...input,
      updatedAt: owner.updatedAt,
      updatedSections: owner.updatedSections,
    };

  return {
    ...input,
    name,
    slug,
    description,
    published,
    ...(published
      ? updateMetadata(owner, ['general'])
      : { updatedAt: owner.updatedAt, updatedSections: [] }),
  };
}

export async function touchSettlement(
  tx: Tx,
  id: string | null | undefined,
  sections: UpdateSection[],
) {
  if (!id) return;
  const owner = await tx.settlements.findUnique({ where: { id } });
  if (owner?.published)
    await tx.settlements.update({
      where: { id },
      data: updateMetadata(owner, sections),
    });
}
export async function touchArchitect(
  tx: Tx,
  id: string | null | undefined,
  sections: UpdateSection[],
) {
  if (!id) return;
  const owner = await tx.architects.findUnique({ where: { id } });
  if (owner?.published)
    await tx.architects.update({
      where: { id },
      data: updateMetadata(owner, sections),
    });
}
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

// Compare public values, ignoring row IDs and mutation timestamps.
export const detailContent = (d: Details) => [
  d.name,
  d.description ?? '',
  d.annotation ?? '',
  d.source ?? '',
  d.detailDate?.toISOString() ?? '',
  d.detailTypeId,
];
export const eventContent = (e: Events) => [
  e.name,
  e.description ?? '',
  e.source ?? '',
  e.eventDate?.toISOString() ?? '',
  e.eventTypeId,
];
export const locationContent = (l: Locations) => [
  l.name ?? '',
  l.address ?? '',
  l.district ?? '',
  l.zipCode ?? '',
  l.city ?? '',
  l.state ?? '',
  l.lat,
  l.lng,
  l.geo,
];
export const resourceSection = (r: Resource): UpdateSection =>
  r.resourceType.name === 'Foto' ? 'photos' : 'links';
export const resourceContent = (r: Resource) => [
  resourceSection(r),
  r.name,
  r.description ?? '',
  r.url,
  r.source ?? '',
  ...(resourceSection(r) === 'photos'
    ? [r.license ?? '', r.copyright ?? '']
    : []),
];
const linkContent = (l: ArchitectLink) => [
  l.platform?.name || l.name || '',
  l.description ?? '',
  l.url,
];

export function saveSettlementPart<T extends SettlementPart, Result extends T>(
  read: ((tx: Tx) => Promise<T | null>) | undefined,
  mutate: (tx: Tx, before: T | null) => Promise<Result>,
  section: UpdateSection | ((row: T) => UpdateSection),
  content: (row: T) => unknown,
) {
  return transaction(prisma, async (tx) => {
    const before = read ? await read(tx) : null;
    const after = await mutate(tx, before);
    if (
      before?.published === after.published &&
      before.settlementId === after.settlementId &&
      JSON.stringify(content(before)) === JSON.stringify(content(after))
    )
      return after;
    const visible = [before, after].filter((row): row is T =>
      Boolean(row?.published),
    );
    for (const id of new Set(visible.map((row) => row.settlementId))) {
      const sections = [
        ...new Set(
          visible
            .filter((row) => row.settlementId === id)
            .map((row) =>
              typeof section === 'function' ? section(row) : section,
            ),
        ),
      ];
      await touchSettlement(tx, id, sections);
      if (section === 'location' && id) await touchSettlementArchitects(tx, id);
    }
    return after;
  });
}

export function saveArchitectLink(
  read: ((tx: Tx) => Promise<ArchitectLink | null>) | undefined,
  mutate: (tx: Tx) => Promise<ArchitectLink>,
) {
  return transaction(prisma, async (tx) => {
    const before = read ? await read(tx) : null;
    const after = await mutate(tx);
    if (
      before?.published === after.published &&
      before.architectId === after.architectId &&
      JSON.stringify(linkContent(before)) === JSON.stringify(linkContent(after))
    )
      return after;
    for (const id of new Set(
      [before, after]
        .filter((row) => row?.published)
        .map((row) => row!.architectId),
    ))
      await touchArchitect(tx, id, ['links']);
    return after;
  });
}

export function saveArchitectAssignment<T extends SettlementsOnArchitects>(
  where: Prisma.SettlementsOnArchitectsWhereUniqueInput | undefined,
  mutate: (tx: Tx) => Promise<T>,
) {
  return transaction(prisma, async (tx) => {
    const before = where
      ? await tx.settlementsOnArchitects.findUnique({ where })
      : null;
    const after = await mutate(tx);
    const membershipChanged =
      !before ||
      before.settlementId !== after.settlementId ||
      before.architectId !== after.architectId;
    if (membershipChanged || (before.role ?? '') !== (after.role ?? '')) {
      for (const id of new Set([before?.settlementId, after.settlementId]))
        await touchSettlement(tx, id, ['architects']);
    }
    // Roles are rendered on settlement pages only.
    if (membershipChanged) {
      for (const id of new Set([before?.architectId, after.architectId]))
        await touchArchitect(tx, id, ['settlements']);
    }
    return after;
  });
}

export function savePlatform<T extends Platforms>(
  where: Prisma.PlatformsWhereUniqueInput,
  mutate: (tx: Tx) => Promise<T>,
) {
  return transaction(prisma, async (tx) => {
    const before = await tx.platforms.findUnique({ where });
    const after = await mutate(tx);
    if (before?.name !== after.name) {
      const links = await tx.externalLinks.findMany({
        where: { platformId: after.id, published: true },
        select: { architectId: true },
      });
      for (const id of new Set(links.map((link) => link.architectId)))
        await touchArchitect(tx, id, ['links']);
    }
    return after;
  });
}
