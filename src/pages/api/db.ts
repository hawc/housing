// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


import { NextApiRequest, NextApiResponse } from 'next';

import { createArchitect, deleteArchitect, findArchitects } from '@/lib/db';

interface AddArchitectPayload {
  name: string;
}

interface GetArchitectsPayload {
  name: string;
}

interface DeleteArchitectsPayload {
  id: string;
}

const resolvers = {
  addArchitect: (payload: AddArchitectPayload) => {
    console.log(payload)
    return createArchitect(payload);
  },
  getArchitects: (payload: GetArchitectsPayload) => {
    return findArchitects(payload);

  },
  deleteArchitect: (payload: DeleteArchitectsPayload) => {
    const data = { id: BigInt(payload.id) };
    return deleteArchitect(data);
  }
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const body = await JSON.parse(req.body);
  const method = body.type as keyof typeof resolvers;
  if (!resolvers[method]) {
    throw new Error('wrong action');
  }
  if (!body) {
    throw new Error('body missing');
  }
  const response = await resolvers[method](body.payload);
  const transformedResponse = Array.isArray(response) ? response.map(({ name, id }) => ({ name, id: id.toString() })) : { name: response.name, id: response.id.toString() };

  res.status(200).json(transformedResponse);
}