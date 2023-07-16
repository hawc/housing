import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import * as React from 'react';

import { Box, Container } from '@/components/blocks/Box';
import { Link as StyledLink } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  const { user } = useUser();

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <section>
        <Container>
          <Box className='p-0 md:p-0'>
            <Image src='/images/header-01.png' alt='header' width={1280} height={400} priority />
          </Box>
          <Box>
            <p>
              Ein Katalog von Großwohnsiedlungen in Deutschland.
              Der Fokus liegt dabei auf Tafel- bzw. Plattenbauten, soll aber andere Bauweisen nicht ausschließen.
              Auch Baudenkmäler des Brutalismus werden als solche gekennzeichnet.
            </p>
            <p>
              Wie 1986 vom Bundesminister für Bauwesen, Raumordnung und Städtebau definiert, werden hier Gebäude gelistet, die den folgenden Kriterien entsprechen:
            </p>
            <List className='mt-4'>
              <ListItem>nach 1945 erbaut</ListItem>
              <ListItem>funktional eigenständige Siedlungseinheit</ListItem>
              <ListItem>dichte, hochgeschossige, relativ homogene Bebauung</ListItem>
              <ListItem>mindestens 1000 Wohneinheiten</ListItem>
              <ListItem>überwiegend sozialer Wohnungsbau</ListItem>
            </List>
          </Box>
          <Box>
            <StyledLink href='/siedlungen' arrow>Zum Archiv</StyledLink>
          </Box>
          <Box>
            <StyledLink href='/architekten' arrow>Architekten</StyledLink>
          </Box>
          {user && (
            <Box>
              <Headline type='h3' tag='h2' className='mb-2'>Administration</Headline>
              <StyledLink href='/admin/siedlungen' arrow>Siedlungen</StyledLink>
              <StyledLink href='/admin/architekten' arrow>Architekten</StyledLink>
              <StyledLink href='/admin/tags' arrow>Tags</StyledLink>
            </Box>
          )}
        </Container>
      </section>
    </Layout>
  );
}
