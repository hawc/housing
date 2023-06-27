
interface Payload {
  type: string;
  payload?: AddArchitectPayload | DeleteArchitectPayload;
}

interface AddArchitectPayload {
  name: string;
}
interface DeleteArchitectPayload {
  id: string;
}

export async function callAPI(payload: Payload) {
  try {
    const res = await fetch('/api/db', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}