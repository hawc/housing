'use client';

import { usePathname } from 'next/navigation';

import { Box } from '@/components/common/Box';
import { Link } from '@/components/common/Link';

export function ContactLink() {
  const pathname = usePathname();

  return (
    <Box className='bg-white text-black'>
      <div className='flex flex-row justify-between'>
        <div>Es sind Informationen falsch oder unvollständig? Bitte schreib uns über das <Link href={`/kontakt?from=${pathname}`}>Kontaktformular</Link>!</div>
      </div>
    </Box>
  );
}