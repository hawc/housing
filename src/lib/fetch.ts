import { logger } from '@/lib/logger';

// Mutations must report failures to the editor. Keep fetchData's fallbacks for
// existing read callers, which deliberately tolerate unavailable responses.
export async function fetchMutation<T>(
  path: string,
  options: RequestInit = { method: 'POST' },
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  let response: Response;
  try {
    response = await fetch(`${process.env.BASE_URL ?? ''}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Die Änderung konnte nicht gesendet werden. Bitte Verbindung prüfen und erneut versuchen.',
    );
  }
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      result &&
      typeof result === 'object' &&
      'error' in result &&
      typeof result.error === 'string'
        ? result.error.trim()
        : '';
    throw new Error(
      message ||
        `Änderung fehlgeschlagen (HTTP ${response.status}). Bitte erneut versuchen.`,
    );
  }
  if (result === null)
    throw new Error(
      'Die Änderung konnte nicht bestätigt werden. Bitte den Eintrag neu laden.',
    );
  return result as T;
}

export async function fetchData<T, D = undefined>(
  path: string,
  fallback?: D,
  data: RequestInit = { method: 'GET' },
): Promise<T | D> {
  let response;

  try {
    response = await fetch(`${process.env.BASE_URL ?? ''}${path}`, data);
  } catch (error) {
    logger(error, 'There was an error');
  }

  if (response?.ok) {
    const responseData: T = await response.json();
    return responseData;
  } else {
    logger(response?.status, 'HTTP response not ok.');
  }

  return fallback as D;
}
