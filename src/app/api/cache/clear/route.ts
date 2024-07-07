import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

async function clearCache() {
  return await prisma.tags.upsert({
    where: {
      name: 'flush'
    },
    update: {
      published: false
    },
    create: {
      name: 'flush',
      published: false
    }
  });
}

export async function GET(_req: NextRequest) {
  await clearCache();

  return NextResponse.json('');
}
