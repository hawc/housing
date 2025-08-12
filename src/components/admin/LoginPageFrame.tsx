'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default function LoginPageFrame({ children }: PropsWithChildren) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/');
    return <>Bitte einloggen.</>;
  }

  return <>{children}</>;
}
