import { auth0 } from '@/lib/auth0';
import { isAdminSubject } from '@/lib/adminAccess';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export async function LoginPageFrame({ children }: PropsWithChildren) {
  const session = await auth0.getSession();

  if (!session) {
    return redirect('/');
  }

  if (!isAdminSubject(session.user.sub)) {
    return (
      <p className='my-6'>
        Dieses Konto hat keinen Adminzugriff. Hinterlege deine Auth0-Kennung in
        ADMIN_USER_SUBS: <code>{session.user.sub}</code>
      </p>
    );
  }

  return <>{children}</>;
}
