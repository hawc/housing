import { TagsLogic } from '@/app/api/tags/TagsLogic';
import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_req: NextRequest, props) {
  const { tagId, settlementId } = await props.params;
  const data: Prisma.TagsUpdateInput = {
    settlements: {
      delete: {
        settlementId_tagId: {
          tagId,
          settlementId,
        },
      },
    },
  };

  await TagsLogic.updateTag({ id: tagId }, data);

  return NextResponse.json('');
}
