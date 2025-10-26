import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ExternalLinksLogic } from '@/app/api/externalLinks/ExternalLinksLogic';

export async function GET(_req: NextRequest, props) {
  const { id } = await props.params;

  await ExternalLinksLogic.deleteExternalLink({ id });

  return NextResponse.json('');
}
