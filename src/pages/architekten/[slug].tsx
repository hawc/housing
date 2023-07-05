
import { InferGetStaticPropsType } from 'next';

import { callAPI } from '@/lib/api';

import { Architect } from '@/components/architects/View';
import { Box } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import Layout from '@/components/layout/Layout';

import type { Architect as ArchitectType } from '@/pages/admin';


export async function getStaticPaths() {
  const architects: ArchitectType[] = await callAPI({ type: 'getArchitects' });
  return {
    paths: architects ? architects.map(architect => (
      {
        params: { slug: architect.slug }
      }
    )) : [],
    fallback: true,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }): Promise<{ props: { architect: ArchitectType } }> {
  const architect: ArchitectType = await callAPI({ type: 'getArchitect', payload: { where: { slug: params.slug } } });

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
