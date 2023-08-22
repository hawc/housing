import { findArchitects } from '@/lib/db';

import { ListArchitects } from '@/components/admin/architects/List';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

async function getArchitects() {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);

  return architects;
}

export default async function Architects() {
  const architects = await getArchitects();
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
