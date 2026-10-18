import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DetailsLogic } from './../../DetailsLogic';

export async function GET(_req: NextRequest, props) {
  const denied = await guardAdminRequest(_req);
  if (denied) return denied;

  const { id } = await props.params;

  await DetailsLogic.deleteDetail({ id });

  return NextResponse.json('');
}
