import { findTags } from '@/lib/db';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListTags } from '@/components/admin/tags/List';
import Layout from '@/components/layout/Layout';

import { BaseTag } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

async function getTags() {
  const tags: BaseTag[] = (await findTags()).map(baseTransformers.tag);

  return tags;
}

export default async function Admin() {
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
