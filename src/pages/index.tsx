import Image from 'next/image';
import * as React from 'react';

import { Box, Container } from '@/components/blocks/Box';
import { Link, Link as StyledLink } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <section>
        <Container>
          <Image src='/images/header-01.png' alt='header' width={1280} height={400} />
          <Box>
            Ein Katalog von Großwohnsiedlungen in Deutschland. Der Fokus liegt dabei auf Tafel- bzw. Plattenbauten, soll aber andere Bauweisen nicht ausschließen. Auch Baudenkmäler des Brutalismus werden als solche gekennzeichnet.
          </Box>
          <Box>
            <StyledLink href='/settlements' arrow>Zum Archiv</StyledLink>
          </Box>
          <Box>
            <List>
              <ListItem>
                <Link href="/architects">
                  Architekten
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/settlements">
                  Siedlungen
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/tags">
                  Tags
                </Link>
              </ListItem>
            </List>
          </Box>
        </Container>
      </section>
    </Layout>
  );
}
