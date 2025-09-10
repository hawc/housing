import { auth0 } from '@/lib/auth0';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';

interface LoginButtonProps {
  className?: string;
}

export async function LoginButton({ className = '' }: LoginButtonProps) {
  const session = await auth0.getSession();

  return (
    <span className={`p-1 md:p-2 hidden md:block ${className}`}>
      {session ? (
        <Link href='/auth/logout'>
          <LogOutIcon />
          <span className='sr-only'>Logout</span>
        </Link>
      ) : (
        <Link href='/auth/login'>
          <LogInIcon />
          <span className='sr-only'>Login</span>
        </Link>
      )}
    </span>
  );
}
