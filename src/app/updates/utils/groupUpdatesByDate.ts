import { BaseArchitect, BaseSettlement } from '@/lib/types';

function getDateAsISO(date: Date) {
  return new Date(date).toISOString().split('T')[0];
}

function getTime(date: Date) {
  const parsedDate = new Date(date);

  // only return date without time
  return Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate());
}

function wasUpdated(update: BaseSettlement | BaseArchitect) {
  return getTime(update.updatedAt) > getTime(update.createdAt);
}

type UpdateType = 'architect' | 'settlement';
type ChangeType = 'updated' | 'created';

interface UpdateExtra {
  type: UpdateType;
  latestChange: Date;
  changeType: ChangeType;
}

type Update = (BaseSettlement | BaseArchitect) & UpdateExtra;

export type UpdateMap = Record<string, (Update)[]>;

export function groupUpdatesByDate(updates: BaseSettlement[] | BaseArchitect[], type: UpdateType) {
  const allUpdates = updates.map((update: BaseSettlement | BaseArchitect) => ({
    ...update,
    type,
    latestChange: wasUpdated(update) ? update.updatedAt : update.createdAt,
    changeType: wasUpdated(update) ? 'updated' : 'created',
  } as Update));

  const sortedUpdates = allUpdates.sort((a, b) => getTime(b.latestChange) - getTime(a.latestChange));

  const allUpdatesByDate = sortedUpdates.reduce((acc, update) => {
    const date = getDateAsISO(update.latestChange);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(update);
    return acc;
  }, {} as UpdateMap);

  return allUpdatesByDate;
}