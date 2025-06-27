import type { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';
import { BaseSettlement } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import { Link } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'Updates',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-DE', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getDateAsISO(date: string) {
  return new Date(date).toISOString().split('T')[0];
}

function getTime(date: string) {
  return new Date(date).getTime();
}

function getUpdatesGroupedByDate(settlements: BaseSettlement[]) {
  const allUpdates = settlements.map(update => ({
    ...update,
    latestChange: getTime(update.updatedAt) > getTime(update.createdAt) ? update.updatedAt : update.createdAt,
    changeType: getTime(update.updatedAt) > getTime(update.createdAt) ? 'updated' : 'created',
  })).sort((a, b) => getTime(b.latestChange) - getTime(a.latestChange));

  const allUpdatesByDate = allUpdates.reduce((acc, update) => {
    const date = getDateAsISO(update.latestChange);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(update);
    return acc;
  }, {} as Record<string, typeof allUpdates>);

  return allUpdatesByDate;
}

export default async function Updates() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', []);
  const updates = getUpdatesGroupedByDate(settlements);

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb>Updates</Breadcrumb>
      </Breadcrumbs>
    }>
      <section>
        <Box ghost>
          <div className='flex mt-6'>
            <Headline type='h1'>Updates</Headline>
          </div>
        </Box>
        <Box>
          <div className='flex flex-col gap-6'>
            {Object.entries(updates).map(([date, update]) => (
              <div key={date}>
                <Headline type='h2'>{formatDate(date)}</Headline>
                {update.map(update => (
                  <div key={update.id} className='flex sm:flex-row flex-col sm:gap-2 leading-relaxed mt-4 sm:mt-0'>
                    <Link href={`/siedlungen/${update.slug}`}>{update.name}</Link><span className="sr-only">, </span><span className='font-thin tracking-wide'>{update.location?.city}</span><span className="sr-only">, </span><span className='text-gray-500 font-thin tracking-wide'>({update.changeType === 'updated' ? 'zuletzt aktualisiert' : 'neu hinzugefügt'})</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Box>
      </section>
    </Layout>
  );
}
