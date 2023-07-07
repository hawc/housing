
import { findTags } from '@/lib/db';

import { ListTags } from '@/components/admin/tags/List';
import Layout from '@/components/layout/Layout';

import { BaseTag } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticProps(): Promise<{ props: { tags: BaseTag[] } }> {
  const tags: BaseTag[] = (await findTags()).map(baseTransformers.tag);

  return {
    props: {
      tags,
    },
  };
}

export default function Admin({ tags }: { tags: BaseTag[] }) {
  return (
    <Layout>
      <ListTags tagsInput={tags} />
    </Layout>
  );
}
