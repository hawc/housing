import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ExternalLinksLogic } from '@/app/api/externalLinks/ExternalLinksLogic';

export async function POST(req: NextRequest, props) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const { id } = await props.params;
  const data = await req.json();

  const externalLink = await ExternalLinksLogic.updateExternalLink(
    { id },
    data,
  );

  if (!externalLink) {
    return NextResponse.json('');
  }

  const responseData = ExternalLinksLogic.toExternalLink(externalLink);
  return NextResponse.json(responseData);
}
