import { Box, Container } from '@/components/blocks/Box';
import { ContactLink } from '@/components/blocks/ContactLink';
import { Link } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';
import { SettlementsMap } from '@/components/settlements/SettlementsMap';

import type { BaseArchitect } from '@/app/admin/page';

export function Architect({ architect }: { architect: BaseArchitect }) {
  const locations = architect.settlements.flatMap(settlement => settlement.location ? ({
    ...settlement.location,
    settlement: {
      name: settlement.name,
      slug: settlement.slug
    },
  }) : []);

  return (
    <>
      <div className='flex mt-6'>
        <Headline type='h1' className='inline-block'>{architect.name}</Headline>
      </div>
      <Container>
        <Box>
          <p>{architect.description || 'Für diese*n Architekt*in haben wir bisher keine Beschreibung.'}</p>
        </Box>
        {locations.length > 0 && (
          <>
            <Box>
              <Headline type='h2'>Siedlungen</Headline>
              {architect.settlements.map(settlement => (
                <div key={settlement.slug}>
                  <Link className='inline-block mr-2' href={`/siedlungen/${settlement.slug}`}>
                    {settlement.name}
                  </Link>{'location' in settlement && settlement.location && (
                    <><span className='sr-only'>, </span><span className='font-thin tracking-wide'>{settlement.location.city}</span></>
                  )}
                </div>
              ))}
            </Box>
            <Box className='p-0 md:p-0'>
              <SettlementsMap locationsInput={locations} />
            </Box>
          </>
        )}
        {architect.urls.length > 0 && (
          <Box>
            <div>
              <Headline type='h2'>Weblinks</Headline>
              {architect.urls.map(externalLink => (
                <div key={externalLink.id}>
                  <Link href={externalLink.url} className='inline'>{externalLink.platform?.name || externalLink.name}</Link> {externalLink.description && <>({externalLink.description})</>}
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