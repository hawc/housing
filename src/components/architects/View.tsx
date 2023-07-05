import { Box, Container } from '@/components/blocks/Box';
import { Headline } from '@/components/Headline';

import type { Architect } from '@/pages/admin';

export function Architect({ architect }: { architect: Architect }) {
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
        </Container>
      </Container>
    </>
  );
}