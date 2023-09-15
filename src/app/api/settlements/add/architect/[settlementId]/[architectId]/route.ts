import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(_req: NextRequest, { params }) {
  await addSettlementsOnArchitect({ settlementId: params.settlementId, architectId: params.architectId });

  return NextResponse.json('');
}