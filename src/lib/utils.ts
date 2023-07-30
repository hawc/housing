export function sortAlphabetically(array) {
  return array.sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

export function sortByDate(array) {
  return array.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
}