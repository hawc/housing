import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

import { Box, Container } from '@/components/blocks/Box';
import { Link as LinkElement } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

import type { BaseArchitect } from '@/pages/admin';

export function Architect({ architect }: { architect: BaseArchitect }) {
  return (
    <>
      <div className='flex'>
        <Headline type='h1' className='inline-block'>{architect.name}</Headline>
        <div>
          <Link className='block ml-3 p-2 rounded-full bg-highlight' href='/architekten'>
            <ArrowLeftIcon className='align-text-bottom' size={15} />
          </Link>
        </div>
      </div>
      <Container>
        {architect.description && (
          <Box>
            <p>{architect.description}</p>
          </Box>
        )}
        <Box>
          <Headline type='h3' tag='h2'>Siedlungen</Headline>
          <>
            {architect.settlements.map(settlement => (
              <LinkElement key={settlement.slug} href={`/siedlungen/${settlement.slug}`} arrow>
                {settlement.name}
              </LinkElement>
            ))}
          </>
        </Box>
      </Container>
    </>
  );
}