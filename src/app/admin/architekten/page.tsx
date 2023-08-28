import { ListArchitects } from '@/components/admin/architects/List';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';

async function getArchitects() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/all`);
  const architects: BaseArchitect[] = await response.json();

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
