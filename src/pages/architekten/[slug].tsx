
import { InferGetStaticPropsType } from 'next';

import { findArchitect, findArchitects } from '@/lib/db';

import { Architect } from '@/components/architects/View';
import { Box } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
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

export async function getStaticProps({ params }: { params: { slug: string } }): Promise<{ props: { architect: BaseArchitect } }> {
  const architect: BaseArchitect = baseTransformers.architect(await findArchitect({ where: { slug: params.slug } }));

  return {
    props: {
      architect,
    },
  };
}

export default function ArchitectPage({ architect }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <section>
        <Box ghost className='mb-2'>
          <Link href='/architekten' arrow back>zurück zur Übersicht</Link>
        </Box>
        {architect && (
          <Architect architect={architect} />
        )}
      </section>
    </Layout>
  );
}
