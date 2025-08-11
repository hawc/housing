'use client';

import { Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { BaseSettlement } from '@/lib/types';

import { ArchitectsList } from '@/components/admin/settlements/Architects';
import { DetailsList } from '@/components/admin/settlements/Details';
import { Location } from '@/components/admin/settlements/Location';
import { ResourcesList } from '@/components/admin/settlements/Resources';
import { TagList } from '@/components/admin/settlements/Tags';
import { Timeline } from '@/components/admin/settlements/Timeline';
import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

interface SettlementEditProps {
  settlementInput?: BaseSettlement;
}

export function SettlementEdit({ settlementInput }: SettlementEditProps) {
  const router = useRouter();
  const [settlement, setSettlement] = useState<BaseSettlement | undefined>(settlementInput);
  const [loading, setLoading] = useState<boolean>(false);

  const Map = dynamic(() => import('@/components/settlements/Map'), {
    ssr: false
  });

  function updateSettlement(input: Partial<BaseSettlement>) {
    setSettlement({
      ...settlement,
      ...input,
    } as BaseSettlement);
  }

  async function submitData(settlement: Partial<BaseSettlement>) {
    setLoading(true);
    const data = {
      name: settlement.name,
      description: settlement.description,
    };
    if (settlement?.slug) {
      const responseSettlement = await fetchData<BaseSettlement>(`/api/settlements/update/${settlement.slug}`, undefined, { method: 'POST', body: JSON.stringify(data) });
      setSettlement(responseSettlement);
    } else {
      const responseSettlement = await fetchData<BaseSettlement>('/api/settlements/add', undefined, { method: 'POST', body: JSON.stringify(data) });
      if (responseSettlement?.slug) {
        router.push(`/admin/siedlungen/${responseSettlement.slug}`);
      }
    }
    setLoading(false);
  }

  async function getSettlement(slug: string) {
    setLoading(true);
    const settlement = await fetchData<BaseSettlement>(`/api/settlements/get/${slug}`);
    setSettlement(settlement);
    setLoading(false);
  }

  async function deleteSettlement(slug: string) {
    setLoading(true);
    await fetchData(`/api/settlements/delete/${slug}`);
    router.push('/siedlungen');
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='inline-block'>
            <InputGhost
              className='text-inherit'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateSettlement({ name: event.target.value })}
              value={settlement?.name ?? ''} />
          </Headline>
          {settlement?.id && (
            <div>
              {loading ? (
                <div className='inline-block pb-1'>
                  <Loader2Icon className='animate-spin' />
                </div>
              ) : (settlement?.tags &&
                (
                  <TagList
                    key={Object.keys(settlement.tags).length}
                    className='ml-2'
                    getSettlement={() => getSettlement(settlement.slug)}
                    existingTags={settlement.tags}
                    settlementId={settlement?.id} />
                )
              )}
            </div>
          )}
        </div>
      </Box>
      <Container>
        <Container>
          <Box>
            <TextareaGhost
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => updateSettlement({ description: event.target.value })}
              value={settlement?.description ?? ''} />
          </Box>
        </Container>
        {settlement?.id && (
          <>
            <Container className='grid-cols-1 md:grid-cols-2'>
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Historie</Headline>
                <Timeline
                  settlementId={settlement.id}
                  eventsInput={settlement?.events ?? []} />
              </Box>
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Details</Headline>
                <DetailsList detailsInput={settlement?.details ?? []} settlementId={settlement.id} />
              </Box>
            </Container>
            <Container className='md:grid-cols-2'>
              <Box>
                <>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    Architekt*innen
                  </Headline>
                  <ArchitectsList
                    key={Object.keys(settlement?.architects ?? {}).length}
                    getSettlement={() => getSettlement(settlement.slug)}
                    architects={settlement?.architects}
                    settlementId={settlement.id} />
                </>
              </Box>
              <>
                <Box>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    Ressourcen
                  </Headline>
                  <ResourcesList
                    resourcesInput={settlement?.resources ?? []}
                    settlementId={settlement?.id}
                    settlementSlug={settlement?.slug} />
                </Box>
              </>
            </Container>
            <>
              {settlement?.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
                <Container>
                  <Box className='p-0 md:p-0'>
                    <Map
                      key={`${settlement.location.lat}${settlement.location.lng}`}
                      markers={[settlement.location]}
                      geo={settlement.location.geo}
                      center={{ lat: settlement.location.lat, lng: settlement.location.lng }} />
                  </Box>
                </Container>
              )}
              <Box>
                <Location settlementId={settlement.id} locationInput={settlement?.location ?? undefined} onUpdate={() => getSettlement(settlement.slug)} />
              </Box>
            </>
          </>
        )}
        <Container className='md:grid-cols-3'>
          <Box>
            <Button onClick={settlement ? () => submitData(settlement) : () => { return; }} disabled={loading || !(settlement?.name)}>
              Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
            </Button>
          </Box>
          <Box>
            <Link href='/admin/siedlungen' className='inline-block py-1 px-3 text-center border border-text'>
              Abbrechen
            </Link>
          </Box>
          <Box>
            <Button className='bg-text text-bg border border-text'
              onClick={settlement?.id ? () => deleteSettlement(settlement.id) : () => { return; }}
              disabled={loading || !(settlement?.id)}>
              Löschen
              {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
}