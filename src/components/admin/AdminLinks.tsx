'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import { Box } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

export function AdminLinks() {
  const { user, isLoading } = useUser();

  if (isLoading || !user) {
    return <></>;
  }

  return (
    <>
      <Headline type='h1' className='mt-6'>Administration</Headline>
      <Box ghost className='mb-6'>
        <Link href='/admin/siedlungen' arrow>Siedlungen</Link>
        <Link href='/admin/architekten' arrow>Architekt*innen</Link>
        <Link href='/admin/tags' arrow>Tags</Link>
        <Link href='/admin/plattformen' arrow>Plattformen</Link>
      </Box>
    </>
  );
}
