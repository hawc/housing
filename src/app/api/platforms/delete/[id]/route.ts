import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PlatformsLogic } from './../../PlatformsLogic';

export async function GET(_req: NextRequest, props) {
  const denied = await guardAdminRequest(_req);
  if (denied) return denied;

  const { id } = await props.params;

  await PlatformsLogic.deletePlatform({ id });

  return NextResponse.json('');
}
