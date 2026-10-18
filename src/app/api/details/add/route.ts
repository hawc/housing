import { guardAdminRequest } from '@/lib/adminAuth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DetailsLogic } from './../DetailsLogic';
import { DetailDateError } from '@/lib/detailDate';
import { DetailValueError } from '@/lib/detailValue';
import { DetailScopeError } from '@/lib/detailScope';

export async function POST(req: NextRequest) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  try {
    const data = await req.json();

    const detail = await DetailsLogic.addDetail(data);

    if (!detail) {
      return NextResponse.json('');
    }

    const responseData = DetailsLogic.toBaseDetail(detail);
    return NextResponse.json(responseData);
  } catch (error) {
    if (
      error instanceof DetailDateError ||
      error instanceof DetailValueError ||
      error instanceof DetailScopeError
    )
      return NextResponse.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
