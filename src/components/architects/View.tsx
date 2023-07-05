import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

import type { BaseArchitect } from '@/pages/admin';

export function Architect({ architect }: { architect: BaseArchitect }) {
  return (
    <>
      <Container>
        <Container>
          <Box>
            <>
              <div className='align-middle'>
                <Headline type="h1" className='inline-block'>{architect.name}</Headline>
              </div>
              {architect.description && (
                <p>{architect.description}</p>
              )}
            </>
          </Box>
          <Box>
            <Headline type='h3' tag='h2'>Siedlungen</Headline>
            <>
              {architect.settlements.map(settlement => (
                <>
                  <Link href={`/siedlungen/${settlement.slug}`} arrow>
                    {settlement.name}
                  </Link>
                </>
              ))}
            </>
          </Box>
        </Container>
      </Container>
    </>
  );
}