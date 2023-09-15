
export async function fetchData<T, D = undefined>(path: string, data?: RequestInit, fallback?: D): Promise<T | D> {
  let response;

  try {
    if (data) {
      response = await fetch(`${process.env.BASE_URL ?? ''}${path}`);
    } else {
      response = await fetch(`${process.env.BASE_URL ?? ''}${path}`, data);
    }
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