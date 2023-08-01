export function sortAlphabetically(array) {
  return array.sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

export function sortByDate(array, type: string) {
  return array.sort((a, b) => new Date(a[type]).getTime() - new Date(b[type]).getTime());
}