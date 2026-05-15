import { auth0 } from '@/lib/auth0';
import { LogInIcon, LogOutIcon } from 'lucide-react';

interface LoginButtonProps {
  className?: string;
}

export async function LoginButton({ className = '' }: LoginButtonProps) {
  const session = await auth0.getSession();

  return (
    <span className={`p-1 md:p-2 hidden md:block ${className}`}>
      {session ? (
        <a href='/auth/logout'>
          <LogOutIcon />
          <span className='sr-only'>Logout</span>
        </a>
      ) : (
        <a href='/auth/login'>
          <LogInIcon />
          <span className='sr-only'>Login</span>
        </a>
      )}
    </span>
  );
}
