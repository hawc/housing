export type ArrayMap<T> = Record<string, T[]>;

export function mergeArrayObjects<T>(
  o1: ArrayMap<T>,
  o2: ArrayMap<T>,
  opts: { dedupe?: boolean } = {}
): ArrayMap<T> {
  const { dedupe = false } = opts;
  const out: ArrayMap<T> = { ...o1 };

  for (const [key, arr] of Object.entries(o2) as [string, T[]][]) {
    const merged = key in out ? [...out[key], ...arr] : [...arr];
    out[key] = dedupe ? [...new Set<T>(merged)] : merged;
  }

  return out;
}
