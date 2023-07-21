import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import slugify from 'slugify';

import { callAPI } from '@/lib/api';

import { ArchitectsList } from '@/components/admin/settlements/Architects';
import { DetailsList } from '@/components/admin/settlements/Details';
import { Location } from '@/components/admin/settlements/Location';
import { TagList } from '@/components/admin/settlements/Tags';
import { Timeline } from '@/components/admin/settlements/Timeline';
import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

import type { BaseSettlement } from '@/pages/admin';

export type Partial<T> = { [P in keyof T]?: T[P] };

export function SettlementEdit({ settlementInput }: { settlementInput: BaseSettlement | null }) {
  const router = useRouter();
  const [settlement, setSettlement] = useState<BaseSettlement>(settlementInput);
  const [loading, setLoading] = useState<boolean>(false);

  const Map = dynamic(() => import('@/components/admin/settlements/Map'), {
    ssr: false
  });

  const updateSettlement = (input: Partial<BaseSettlement>) => {
    setSettlement({
      ...settlement,
      ...input,
    } as BaseSettlement)
  }

  const submitData = async () => {
    setLoading(true);
    if (settlement.id) {
      await callAPI({
        type: 'updateSettlement',
        payload: {
          data: {
            name: settlement.name,
            description: settlement.description,
          },
          where: { id: settlement.id }
        }
      });
      await getSettlement();
    } else {
      const response = await (callAPI({
        type: 'addSettlement',
        payload: {
          data: {
            name: settlement.name,
            description: settlement?.description ?? '',
          },
        }
      }) as Promise<BaseSettlement>);
      await getSettlement(response?.id);
      router.push(`/admin/siedlungen/${slugify(settlement.name, { lower: true, locale: 'de' })}`)
    }
    setLoading(false);
  }

  const getSettlement = async (id?: string) => {
    setLoading(true);
    if (id || settlement.id) {
      setSettlement(await callAPI({ type: 'getSettlement', payload: { where: { id: id ?? settlement.id } } }));
    }
    setLoading(false);
  }

  const deleteSettlement = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteSettlement', payload: { where: { id } } });
    router.push('/siedlungen');
    setLoading(false);
  };

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
          <div>
            <Link className='block ml-3 p-2 rounded-full bg-highlight' href='/admin/siedlungen'>
              <ArrowLeftIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Link>
          </div>
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
                    getSettlement={getSettlement}
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
            <Container cols="grid-cols-1 md:grid-cols-2">
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Historie</Headline>
                <Timeline
                  settlementId={settlement?.id}
                  events={settlement?.events ?? []} />
              </Box>
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Details</Headline>
                <DetailsList detailsInput={settlement?.details ?? []} settlementId={settlement?.id} />
              </Box>
            </Container>
            <Container cols='md:grid-cols-2'>
              <Box>
                <>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    Architekten
                  </Headline>
                  <ArchitectsList
                    key={Object.keys(settlement?.architects ?? {}).length}
                    getSettlement={getSettlement}
                    architects={settlement?.architects}
                    settlementId={settlement?.id} />
                </>
              </Box>
              <>
                <Box>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    Ressource hinzufügen
                  </Headline>
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
                      center={{ lat: settlement.location.lat, lng: settlement.location.lng }} />
                  </Box>
                </Container>
              )}
              <Box>
                <Location settlementId={settlement?.id} locationInput={settlement?.location} onUpdate={getSettlement} />
              </Box>
            </>
          </>
        )}
        <Container cols='md:grid-cols-3'>
          <Box>
            <Button onClick={submitData} disabled={loading || !(settlement?.name)}><>Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</></Button>
          </Box>
          <Box>
            <Link href='/admin/siedlungen' className='inline-block py-1 px-3 text-center border border-text'>Abbrechen</Link>
          </Box>
          <Box>
            <Button className='bg-text text-bg border border-text'
              onClick={() => deleteSettlement(settlement?.id)}
              disabled={loading || !(settlement?.id)}><>Löschen
                {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
}