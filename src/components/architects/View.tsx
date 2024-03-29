'use client';


import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

import type { BaseArchitect } from '@/app/admin/page';

export function Architect({ architect }: { architect: BaseArchitect }) {
  return (
    <>
      <div className='flex mt-6'>
        <Headline type='h1' className='inline-block'>{architect.name}</Headline>
      </div>
      <Container>
        {architect.description && (
          <Box>
            <p>{architect.description}</p>
          </Box>
        )}
        <Box>
          <Headline type='h2'>Siedlungen</Headline>
          <>
            {architect.settlements.map(settlement => (
              <Link key={settlement.slug} href={`/siedlungen/${settlement.slug}`}>
                {settlement.name}
              </Link>
            ))}
          </>
        </Box>
      </Container>
    </>
  );
}