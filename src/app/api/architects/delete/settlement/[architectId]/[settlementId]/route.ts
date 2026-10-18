import { guardAdminRequest } from '@/lib/adminAuth';
import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';

export async function GET(_req: NextRequest, props) {
  const denied = await guardAdminRequest(_req);
  if (denied) return denied;

  const { architectId, settlementId } = await props.params;
  const data: Prisma.ArchitectsUpdateInput = {
    settlements: {
      delete: {
        settlementId_architectId: {
          architectId,
          settlementId,
        },
      },
    },
  };

  await ArchitectsLogic.updateArchitect({ id: architectId }, data);

  return NextResponse.json('');
}
