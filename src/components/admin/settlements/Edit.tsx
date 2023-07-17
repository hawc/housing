import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { DetailsList } from '@/components/admin/settlements/Details';
import { Location } from '@/components/admin/settlements/Location';
import { TagList } from '@/components/admin/settlements/Tags';
import { Timeline } from '@/components/admin/settlements/Timeline';
import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

import type { Architect, BaseSettlement, Tag } from '@/pages/admin';

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
    } else {
      await callAPI({
        type: 'addSettlement',
        payload: {
          data: {
            name: settlement?.name ?? '',
            description: settlement?.description ?? '',
          },
        }
      });
    }
    await getSettlement();
    setLoading(false);
  }

  const getSettlement = async () => {
    setLoading(true);
    if (settlement.id) {
      setSettlement(await callAPI({ type: 'getSettlement', payload: { where: { id: settlement.id } } }));
    }
    setLoading(false);
  }

  const deleteSettlement = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteSettlement', payload: { where: { id } } });
    router.push('/siedlungen');
    setLoading(false);
  };

  const removeTag = async (tag: Tag) => {
    setLoading(true);
    await callAPI({
      type: 'updateTag',
      payload: {
        data: {
          settlements: {
            delete: {
              settlementId_tagId: {
                tagId: tag.id,
                settlementId: settlement.id,
              }
            }
          }
        },
        where: { id: tag.id }
      }
    });
    await getSettlement();
    setLoading(false);
  }

  const addTag = async (tag: Tag) => {
    setLoading(true);
    await callAPI({
      type: 'addSettlementOnTag',
      payload: {
        data: {
          tagId: tag.id,
          settlementId: settlement.id,
        }
      }
    });
    await getSettlement();
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
          <div>
            <Link className='block ml-3 p-2 rounded-full bg-highlight' href='/admin/siedlungen'>
              <ArrowLeftIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Link>
          </div>
          <div>
            {loading ? (
              <div className='inline-block pb-1'>
                <Loader2Icon className='animate-spin' />
              </div>
            ) : (settlement?.tags &&
              (
                <TagList key={Object.keys(settlement.tags).length} className='ml-2' existingTags={settlement.tags} removeTag={removeTag} addTag={addTag} />
              )
            )}
          </div>
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
        <Container>
          <Box>
            <>
              <Headline className='inline-block' tag='h2' type='h3'>
                {settlement?.architects?.length > 1 ? 'Architekten' : 'Architekt'}
              </Headline>
              {settlement?.architects?.map((architect: Architect) => (
                <div key={architect.id}>
                  {architect.name}
                </div>
              ))}
            </>
          </Box>
        </Container>
        <Container cols='md:grid-cols-2'>
          <>
            {settlement?.resources?.filter(resource => resource.type.name === 'Foto').map((resource) => (
              <Box key={resource.id} className="py-3 md:p-0 h-60 lg:h-96 justify-between">
                <div className='bg-grey-light grow flex items-center overflow-hidden mb-1 md:mb-0'>
                  <img src={resource.url} alt={resource.description} loading='lazy' />
                </div>
                <div className='md:px-5 pt-2 md:pt-4 md:pb-4'>
                  {resource.description}
                </div>
              </Box>
            ))}
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
        <Container cols='md:grid-cols-3'>
          <Box>
            <Button onClick={submitData} disabled={loading || !(settlement?.name)}><>Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</></Button>
          </Box>
          <Box>
            <Link href='/admin/siedlungen' className='inline-block py-1 px-3 text-center border border-text'>Abbrechen</Link>
          </Box>
          <Box>
            <Button className='bg-text text-bg border border-text'
              onClick={() => deleteSettlement(settlement.id)}
              disabled={loading || !(settlement?.id)}><>Löschen
                {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
}