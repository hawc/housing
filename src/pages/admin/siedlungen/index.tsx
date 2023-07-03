import { ListSettlements } from '@/components/admin/settlements/List';
import { Box, Container } from '@/components/blocks/Box';
import Layout from '@/components/layout/Layout';

export default function Admin() {
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
