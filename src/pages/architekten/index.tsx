import { findArchitects } from '@/lib/db';

import { ListArchitects } from '@/components/architects/List';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';


export async function getStaticProps(): Promise<{ props: { architects: BaseArchitect[] } }> {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);

  return {
    props: {
      architects,
    },
  };
}

export default function Architects({ architects }: { architects: BaseArchitect[] }) {
  return (
    <Layout>
      <section>
        <ListArchitects architectsInput={architects} />
      </section>
    </Layout>
  );
}
