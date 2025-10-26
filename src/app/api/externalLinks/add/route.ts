import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ExternalLinksLogic } from '@/app/api/externalLinks/ExternalLinksLogic';
import { baseTransformers } from '@/lib/transformers';

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const externalLink = await ExternalLinksLogic.addExternalLink(data);

  if (!externalLink) {
    return NextResponse.json('');
  }
  
  const responseData = baseTransformers.externalLink(externalLink);
  return NextResponse.json(responseData);
}
