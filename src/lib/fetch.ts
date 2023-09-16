
export async function fetchData<T, D = undefined>(path: string, fallback?: D, data: RequestInit = { method: 'GET' }): Promise<T | D> {
  let response;

  try {
    response = await fetch(`${process.env.BASE_URL ?? ''}${path}`, data);
  } catch (error) {
    console.log('There was an error', error);
  }

  if (response?.ok) {
    const responseData: T = await response.json();
    return responseData;
  } else {
    console.log(`HTTP Response Code: ${response?.status}`);
  }

  return fallback as D;
}