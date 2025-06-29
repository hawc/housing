import { fetchData } from '@/lib/fetch';
import type { BaseTag } from '@/lib/types';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListTags } from '@/components/admin/tags/List';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

async function getTags() {
  const tags = await fetchData<BaseTag[], BaseTag[]>('/api/tags/get/all', []);

  return tags;
}

export default async function Tags() {
  const tags = await getTags();

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb>Tags</Breadcrumb>
      </Breadcrumbs>
    }>
      <LoginPageFrame>
        <section>
          <ListTags tagsInput={tags} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
