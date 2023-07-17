
import { findLocations, findSettlements } from '@/lib/db';

import Layout from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

import { BaseLocation, BaseSettlement } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticProps(): Promise<{ props: { settlements: BaseSettlement[], locations: BaseLocation[] } }> {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);
  const locations: BaseLocation[] = (await findLocations()).map(baseTransformers.location);

  return {
    props: {
      settlements,
      locations,
    },
  };
}

export default function Settlements({ settlements, locations }: { settlements: BaseSettlement[], locations: BaseLocation[] }) {
  return (
    <Layout>
      <section>
        <ListSettlements settlementsInput={settlements} locationsInput={locations} />
      </section>
    </Layout>
  );
}
