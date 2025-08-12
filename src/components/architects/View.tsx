import type { BaseArchitect } from '@/lib/types';

import { Box } from '@/components/common/Box';
import { ContactLink } from '@/components/common/ContactLink';
import { Container } from '@/components/common/Container';
import { Link } from '@/components/common/Link';
import { Headline } from '@/components/Headline';
import { SettlementsMap } from '@/components/settlements/SettlementsMap';
import { useMemo } from 'react';

interface ArchitectProps {
  architect: BaseArchitect;
}

export function Architect({ architect }: ArchitectProps) {
  const locations = useMemo(() => {
    return architect.settlements.flatMap((settlement) => {
      if (!settlement.location) {
        return [];
      }

      return {
        ...settlement.location,
        settlement: {
          name: settlement.name,
          slug: settlement.slug,
        },
      };
    });
  }, [architect.settlements]);

  return (
    <>
      <div className='flex mt-6'>
        <Headline type='h1' className='inline-block'>
          {architect.name}
        </Headline>
      </div>
      <Container>
        <Box ghost className='mb-4'>
          {architect.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: architect.description }}
            ></div>
          ) : (
            <p>
              {'Für diese*n Architekt*in haben wir bisher keine Beschreibung.'}
            </p>
          )}
        </Box>
        {locations.length > 0 && (
          <>
            <Box>
              <Headline type='h2'>Siedlungen</Headline>
              {architect.settlements.map((settlement) => (
                <div key={settlement.slug}>
                  <Link
                    className='inline-block mr-2'
                    href={`/siedlungen/${settlement.slug}`}
                  >
                    {settlement.name}
                  </Link>
                  {'location' in settlement && settlement.location && (
                    <>
                      <span className='sr-only'>, </span>
                      <span className='font-thin tracking-wide'>
                        {settlement.location.city}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </Box>
            <Box className='p-0 md:p-0 overflow-hidden'>
              <SettlementsMap locationsInput={locations} />
            </Box>
          </>
        )}
        {architect.urls.length > 0 && (
          <Box>
            <div>
              <Headline type='h2'>Weblinks</Headline>
              {architect.urls.map((externalLink) => (
                <div key={externalLink.id}>
                  <Link href={externalLink.url} className='inline'>
                    {externalLink.platform?.name || externalLink.name}
                  </Link>{' '}
                  {externalLink.description && (
                    <>({externalLink.description})</>
                  )}
                </div>
              ))}
            </div>
          </Box>
        )}
      </Container>
      <Container>
        <ContactLink />
      </Container>
    </>
  );
}
