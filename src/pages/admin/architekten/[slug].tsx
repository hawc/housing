
import { InferGetStaticPropsType } from 'next';

import { findArchitect, findArchitects } from '@/lib/db';

import { ArchitectEdit } from '@/components/admin/architects/Edit';
import Layout from '@/components/layout/Layout';

import type { BaseArchitect } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticPaths() {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);
  return {
    paths: architects ? architects.map(architect => (
      {
        params: { slug: architect.slug }
      }
    )) : [],
    fallback: true,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }): Promise<{ props: { architect: BaseArchitect }, revalidate: number }> {
  const architect: BaseArchitect = baseTransformers.architect(await findArchitect({ where: { slug: params.slug } }));

  return {
    props: {
      architect,
    },
    revalidate: 10
  };
}

export default function ArchitectPage({ architect }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <section>
        {architect && (
          <ArchitectEdit architectInput={architect} />
        )}
      </section>
    </Layout>
  );
}
