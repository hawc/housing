export function isDateValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}
