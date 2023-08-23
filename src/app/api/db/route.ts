import { NextResponse } from 'next/server';

import { resolvers } from '@/app/api/db/resolvers';

export async function POST(req: Request) {
  const body = await req.json();
  const method = body.type as keyof typeof resolvers;
  if (!resolvers[method]) {
    throw new Error('wrong action');
  }
  if (!body) {
    throw new Error('body missing');
  }
  const response = await resolvers[method](body.payload);

  return NextResponse.json({ success: true, response });
}