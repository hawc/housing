
interface Payload {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: {
    data?: any;
    where?: any;
  };
}

export async function callAPI(payload: Payload) {
  try {
    const path = process.env.NODE_ENV === 'production' ? 'https://siedlungen.hawc.de/api/db' : typeof window === 'undefined' ? 'http://localhost:3000/api/db' : '/api/db';
    const res = await fetch(path, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res?.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}