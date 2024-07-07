import type { Prisma } from '@prisma/client';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';


async function updateTag(
  where: Prisma.TagsWhereUniqueInput,
  data: Prisma.TagsUpdateInput
) {
  return await prisma.tags.update({
    where,
    data
  });
}

export async function GET(_req: NextRequest, { params }) {
  const data: Prisma.TagsUpdateInput = {
    settlements: {
      delete: {
        settlementId_tagId: {
          tagId: params.tagId,
          settlementId: params.settlementId,
        }
      }
    }
  };
  await updateTag({ id: params.tagId }, data);

  return NextResponse.json('');
}