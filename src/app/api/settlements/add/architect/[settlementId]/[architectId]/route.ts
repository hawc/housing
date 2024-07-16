import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { settlementsOnArchitectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

async function addSettlementsOnArchitect(
  data: Prisma.SettlementsOnArchitectsUncheckedCreateInput
) {
  return await prisma.settlementsOnArchitects.create({
    data: data,
    include: settlementsOnArchitectsInclude
  });
}

export async function POST(req: NextRequest, { params }) {
  const data = await req.json();
  await addSettlementsOnArchitect({ settlementId: params.settlementId, architectId: params.architectId, ...data });

  return NextResponse.json('');
}