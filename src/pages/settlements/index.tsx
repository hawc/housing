

import { Box, Container } from '@/components/blocks/Box';
import Layout from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

export default function Settlements() {
  return (
    <Layout>
      <section>
        <Container>
          <Box>
            <ListSettlements />
          </Box>
        </Container>
      </section>
    </Layout>
  );
}
