interface Payload {
  type: string;
  payload?: {
    data?: any;
    where?: any;
    update?: any;
  };
}

export async function callAPI(payload: Payload) {
  try {
    const path = `${process.env.BASE_URL ?? ''}/api/db`;
    const res = await fetch(path, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res?.json();

    if (data.success) {
      return data.response;
    }
    throw new Error('Request not successful.');
  } catch (err) {
    console.error(err);
  }
}