import { findArchitects } from '@/lib/db';

import { ListArchitects } from '@/components/admin/architects/List';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticProps(): Promise<{ props: { architects: BaseArchitect[] }, revalidate: number }> {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);

  return {
    props: {
      architects,
    },
    revalidate: 10
  };
}

export default function Architects({ architects }: { architects: BaseArchitect[] }) {
  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ListArchitects architectsInput={architects} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
