import { findTags } from '@/lib/db';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListTags } from '@/components/admin/tags/List';
import Layout from '@/components/layout/Layout';

import { BaseTag } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticProps(): Promise<{ props: { tags: BaseTag[] }, revalidate: number }> {
  const tags: BaseTag[] = (await findTags()).map(baseTransformers.tag);

  return {
    props: {
      tags,
    },
    revalidate: 10
  };
}

export default function Admin({ tags }: { tags: BaseTag[] }) {
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
