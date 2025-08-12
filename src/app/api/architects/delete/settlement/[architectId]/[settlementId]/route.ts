import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

async function updateArchitect(
  where: Prisma.ArchitectsWhereUniqueInput,
  data: Prisma.ArchitectsUpdateInput
) {
  return await prisma.architects.update({
    where,
    data,
  });
}

export async function GET(_req: NextRequest, props) {
  const params = await props.params;
  const data: Prisma.ArchitectsUpdateInput = {
    settlements: {
      delete: {
        settlementId_architectId: {
          architectId: params.architectId,
          settlementId: params.settlementId,
        },
      },
    },
  };
  await updateArchitect({ id: params.architectId }, data);

  return NextResponse.json('');
}
