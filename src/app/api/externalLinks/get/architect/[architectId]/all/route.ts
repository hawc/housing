import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ExternalLinksLogic } from '@/app/api/externalLinks/ExternalLinksLogic';
import { baseTransformers } from '@/lib/transformers';

export async function GET(_req: NextRequest, props) {
  const { architectId } = await props.params;
  
  const externalLinks = await ExternalLinksLogic.findExternalLinks({
    architectId
  });

  if (!externalLinks) {
    return NextResponse.json([]);
  }

  const responseData = externalLinks.map(baseTransformers.externalLink);
  return NextResponse.json(responseData);
}
