import { BaseArchitect, BaseSettlement } from '@/lib/types';

function getDateAsISO(date: Date) {
  return new Date(date).toISOString().split('T')[0];
}

function getTime(date: Date) {
  return new Date(date).getTime();
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
    latestChange: getTime(update.updatedAt) > getTime(update.createdAt) ? update.updatedAt : update.createdAt,
    changeType: getTime(update.updatedAt) > getTime(update.createdAt) ? 'updated' : 'created',
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