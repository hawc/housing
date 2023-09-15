import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

async function updateArchitect(
  where: Prisma.ArchitectsWhereUniqueInput,
  data: Prisma.ArchitectsUpdateInput
) {
  return await prisma.architects.update({
    where,
    data
  });
}

export async function GET(_req: NextRequest, { params }) {
  const data: Prisma.ArchitectsUpdateInput = {
    settlements: {
      delete: {
        settlementId_architectId: {
          architectId: params.architectId,
          settlementId: params.settlementId,
        }
      }
    }
  };
  await updateArchitect({ id: params.architectId }, data);

  return NextResponse.json('');
}