import { Box } from '@/components/common/Box';
import { Link } from '@/components/common/Link';
import { Headline } from '@/components/Headline';
import { auth0 } from '@/lib/auth0';
import { isAdminSubject } from '@/lib/adminAccess';

export async function AdminLinks() {
  const session = await auth0.getSession();

  if (!isAdminSubject(session?.user.sub)) {
    return null;
  }

  return (
    <>
      <Headline type='h1' className='mt-6'>
        Administration
      </Headline>
      <Box ghost className='mb-6'>
        <Link href='/admin/recherche' arrow>
          Recherche & Review
        </Link>
        <Link href='/admin/siedlungen' arrow>
          Siedlungen
        </Link>
        <Link href='/admin/architekten' arrow>
          Architekt*innen
        </Link>
        <Link href='/admin/tags' arrow>
          Tags
        </Link>
        <Link href='/admin/plattformen' arrow>
          Plattformen
        </Link>
      </Box>
    </>
  );
}
