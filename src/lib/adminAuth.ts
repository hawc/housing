import { NextResponse } from 'next/server';
import { auth0 } from './auth0';
import { isAdminSubject, isSameOrigin } from './adminAccess';

export async function adminSubject(): Promise<string | null> {
  const session = await auth0.getSession();
  return isAdminSubject(session?.user.sub) ? session!.user.sub : null;
}

export async function guardAdminRequest(request: Request) {
  if (!(await adminSubject())) {
    return NextResponse.json(
      { error: 'Keine Administratorberechtigung.' },
      { status: 403 },
    );
  }
  const legacyGet = request.method === 'GET';
  if (
    legacyGet
      ? request.headers.get('sec-fetch-site') !== 'same-origin'
      : !isSameOrigin(request)
  ) {
    return NextResponse.json(
      { error: 'Schreibzugriff nur von der eigenen Website erlaubt.' },
      { status: 403 },
    );
  }
  return null;
}
