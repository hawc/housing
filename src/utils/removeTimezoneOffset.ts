export function removeTimezoneOffset(date: string | number) {
  return new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000;
}
