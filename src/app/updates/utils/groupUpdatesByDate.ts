import { updateDay, updateSections } from '@/lib/contentUpdates';

export interface UpdateOwner {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  updatedSections?: string[];
  location?: { city: string | null } | null;
}
type UpdateType = 'architect' | 'settlement';
export type Update = UpdateOwner & {
  type: UpdateType;
  latestChange: Date;
  changeType: 'updated' | 'created';
  sections: string[];
};
export type UpdateMap = Record<string, Update[]>;

export function groupUpdatesByDate(
  updates: UpdateOwner[],
  type: UpdateType,
): UpdateMap {
  const groups: UpdateMap = {};
  for (const owner of updates) {
    const latestChange = new Date(
      Math.max(
        new Date(owner.createdAt).getTime(),
        new Date(owner.updatedAt).getTime(),
      ),
    );
    const day = updateDay(latestChange);
    const update: Update = {
      ...owner,
      type,
      latestChange,
      changeType:
        day > updateDay(new Date(owner.createdAt)) ? 'updated' : 'created',
      sections: Object.entries(updateSections)
        .filter(([key]) => owner.updatedSections?.includes(key))
        .map(([, label]) => label),
    };
    (groups[day] ??= []).push(update);
  }
  return groups;
}
