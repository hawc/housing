import logger from '@/lib/logger';

export async function fetchData<T, D = undefined>(
  path: string,
  fallback?: D,
  data: RequestInit = { method: 'GET' }
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
