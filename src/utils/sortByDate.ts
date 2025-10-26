export function sortByDate<T>(array: T[], type: string) {
  return array.sort(
    (a, b) => new Date(a[type]).getTime() - new Date(b[type]).getTime(),
  );
}
