import { fetchData } from '@/lib/fetch';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListTags } from '@/components/admin/tags/List';
import Layout from '@/components/layout/Layout';

import { BaseTag } from '@/app/admin/page';

async function getTags() {
  const tags = await fetchData<BaseTag[], BaseTag[]>('/api/tags/get/all', []);

  return tags;
}

export default async function Tags() {
  const tags = await getTags();

  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ListTags tagsInput={tags} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
