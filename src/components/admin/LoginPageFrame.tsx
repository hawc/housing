import { useUser } from '@auth0/nextjs-auth0/client';
import router from 'next/router';


export default function LoginPageFrame({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return <>Bitte einloggen.</>;
  }
  return (
    <>
      {children}
    </>
  );
}
