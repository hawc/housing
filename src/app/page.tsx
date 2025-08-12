import { AdminLinks } from '@/components/admin/AdminLinks';
import { Box } from '@/components/common/Box';
import { Container } from '@/components/common/Container';
import { Link as StyledLink } from '@/components/common/Link';
import { List, ListItem } from '@/components/common/List';
import { Headline } from '@/components/Headline';
import { Layout } from '@/components/layout/Layout';

export default function HomePage() {
  return (
    <Layout isHome>
      <section>
        <Container
          style={{
            marginTop: 'min(calc(var(--header-image-height) - 8vw), 300px)',
          }}
        >
          <Headline type='h1' tag='h1' className='pb-4 md:pb-1 xl:text-center'>
            Ein Archiv für <br />
            <span className=''>Großwohn­siedlungen</span>
            <br />
            in Deutschland.
          </Headline>
          <Box ghost className='mb-6 md:mb-11'>
            <div className='flex flex-col md:flex-row gap-2 md:gap-12 mt-0 mb-4 md:mb-8 xl:justify-center'>
              <StyledLink
                href='/siedlungen'
                className='text-xl md:text-2xl'
                arrow
                highlight
              >
                Zum Archiv
              </StyledLink>
              <StyledLink
                href='/architekten'
                className='text-xl md:text-2xl'
                arrow
                highlight
              >
                Architekt*innen
              </StyledLink>
            </div>
            <p>
              Dieses Archiv bietet einen umfassenden Überblick über deutsche
              Großwohnsiedlungen, oft auch Plattenbauviertel genannt. Es umfasst
              Siedlungen, die grob nach den folgenden Kriterien ausgewählt
              wurden:
            </p>
            <List className='my-4'>
              <ListItem>nach 1945 erbaut</ListItem>
              <ListItem>funktional eigenständige Siedlungseinheit</ListItem>
              <ListItem>
                dichte, hochgeschossige, relativ homogene Bebauung
              </ListItem>
              <ListItem>mindestens 1000 Wohneinheiten</ListItem>
              <ListItem>überwiegend sozialer Wohnungsbau</ListItem>
            </List>
            <p>
              Neben allgemeinen Informationen zu den aufgeführten Siedlungen
              findest du hier auch Details über die Architekt*innen, die an
              diesen Projekten beteiligt waren.
            </p>
          </Box>
          <AdminLinks />
        </Container>
      </section>
    </Layout>
  );
}
