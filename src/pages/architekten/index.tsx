import { ListArchitects } from '@/components/architects/List';
import { Box, Container } from '@/components/blocks/Box';
import Layout from '@/components/layout/Layout';

export default function Architects() {
  return (
    <Layout>
      <section>
        <Container>
          <Box>
            <ListArchitects />
          </Box>
        </Container>
      </section>
    </Layout>
  );
}
