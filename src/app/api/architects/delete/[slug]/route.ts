import { guardAdminRequest } from '@/lib/adminAuth';
import { ArchitectsLogic } from '@/app/api/architects/ArchitectsLogic';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_req: NextRequest, props) {
  const denied = await guardAdminRequest(_req);
  if (denied) return denied;

  const { slug } = await props.params;

  await ArchitectsLogic.deleteArchitect({ slug });

  return NextResponse.json('');
}
