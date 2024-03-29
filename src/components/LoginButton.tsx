'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Loader2Icon, LogInIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';

export function LoginButton({ className = '' }: { className?: string }) {
  const { user, error, isLoading } = useUser();

  if (error) {
    return <></>;
  }

  return (
    <span className={`p-1 md:p-2 ${className}`}>
      {isLoading ? <><Loader2Icon className='animate-spin' /></> :
        user ? (
          <Link href="/api/auth/logout"><LogOutIcon /></Link>
        ) : (
          <Link href="/api/auth/login"><LogInIcon /></Link>
        )
      }
    </span>
  );
}