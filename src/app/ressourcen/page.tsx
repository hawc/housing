import type { Metadata } from 'next';

import { Box } from '@/components/common/Box';
import {
  Breadcrumb,
  Breadcrumbs,
} from '@/components/common/breadcrumbs/Breadcrumbs';
import { Link } from '@/components/common/Link';
import { Headline } from '@/components/Headline';
import { Layout } from '@/components/layout/Layout';
import { fetchData } from '@/lib/fetch';
import { Platform } from '@/lib/types';
import { sortAlphabetically } from '@/utils/sortAlphabetically';

export async function generateMetadata(props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  return {
    title: 'Ressourcen',
    alternates: searchParams.from
      ? { canonical: `${process.env.BASE_URL}/ressourcen` }
      : undefined,
  };
}

const filteredResouces = ['Wikipedia'];

async function getPlatforms() {
  const platforms = await fetchData<Platform[], Platform[]>(
    '/api/platforms/get/all',
    []
  );

  return sortAlphabetically(
    platforms.filter((platform) => !filteredResouces.includes(platform.name))
  );
}

export default async function Ressourcen() {
  const platforms = await getPlatforms();

  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb href='/'>Startseite</Breadcrumb>
          <Breadcrumb>Ressourcen</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <section>
        <Box ghost>
          <div className='flex mt-6'>
            <Headline type='h1'>Ressourcen</Headline>
          </div>
        </Box>
        <Box ghost>
          <p className='mb-4'>
            Auf dieser Seite findest du eine Auswahl weiterführender Websites zu
            Großwohnsiedlungen, Städtebau und Architekt*innen. Die Links bieten
            vertiefende Fachartikel, Bildarchive und Forschungsergebnisse, mit
            denen du dein Wissen über die Geschichte, Planung und Architektur
            dieser Siedlungstypen erweitern kannst.
          </p>
        </Box>
        {platforms.map((platform) => (
          <Box key={platform.id}>
            <Headline type='h2'>{platform.name}</Headline>
            <p>{platform.description}</p>
            <p className='mt-2'>
              <Link href={platform.url} arrow highlight>
                zu {platform.urlIdentifier}
              </Link>
            </p>
          </Box>
        ))}
      </section>
    </Layout>
  );
}
