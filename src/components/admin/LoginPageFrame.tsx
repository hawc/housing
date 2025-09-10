import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export async function LoginPageFrame({ children }: PropsWithChildren) {
  const session = await auth0.getSession();

  if (!session) {
    return redirect('/');
  }

  return <>{children}</>;
}
