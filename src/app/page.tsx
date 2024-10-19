import Image from 'next/legacy/image';

import { AdminLinks } from '@/components/admin/AdminLinks';
import { Box, Container } from '@/components/blocks/Box';
import { Link as StyledLink } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';

export default function HomePage() {
  return (
    <Layout>
      <section>
        <Container>
          <Headline type='h1' className='mt-8'>Großwohn­siedlungen</Headline>
          <Box className='p-0 md:p-0'>
            <Image src='/images/header-01.png' alt='Header image' width={1280} height={400} priority />
          </Box>
          <Box>
            <p>
              Ein Archiv für Großwohnsiedlungen in Deutschland.
            </p>
            <p>
              Dieses Archiv bietet einen umfassenden Überblick über deutsche Großwohnsiedlungen, oft auch Plattenbauviertel genannt.
              Es umfasst Siedlungen, die nach den folgenden Kriterien ausgewählt wurden:
            </p>
            <List className='my-4'>
              <ListItem>nach 1945 erbaut</ListItem>
              <ListItem>funktional eigenständige Siedlungseinheit</ListItem>
              <ListItem>dichte, hochgeschossige, relativ homogene Bebauung</ListItem>
              <ListItem>mindestens 1000 Wohneinheiten</ListItem>
              <ListItem>überwiegend sozialer Wohnungsbau</ListItem>
            </List>
            <p>
              Neben allgemeinen Informationen zu den aufgeführten Siedlungen finden Sie hier
              auch Details über die Architekt*innen, die an diesen Projekten beteiligt waren.
            </p>
          </Box>
          <Box>
            <StyledLink href='/siedlungen' className='text-xl' arrow>Zum Archiv</StyledLink>
          </Box>
          <Box>
            <StyledLink href='/architekten' className='text-xl' arrow>Architekt*innen</StyledLink>
          </Box>
          <AdminLinks />
        </Container>
        {/* <Scene fileUrl='/models/PH16/PH16.stl' className='absolute top-20 -z-10' height="1200px" width="1200px" /> */}
      </section>
    </Layout>
  );
}
