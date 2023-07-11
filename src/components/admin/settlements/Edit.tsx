import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Location } from '@/components/admin/settlements/Location';
import { Map } from '@/components/admin/settlements/Map';
import { TagList } from '@/components/admin/settlements/Tags';
import { Timeline } from '@/components/admin/settlements/Timeline';
import { Box, Container } from '@/components/blocks/Box';
import { DetailsList } from '@/components/blocks/DetailsList';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

import type { Architect, BaseSettlement, Tag } from '@/pages/admin';

export type Partial<T> = { [P in keyof T]?: T[P] };

export function SettlementEdit({ settlementInput }: { settlementInput: BaseSettlement }) {
  const router = useRouter();
  const [settlement, setSettlement] = useState<BaseSettlement>(settlementInput);
  const [loading, setLoading] = useState<boolean>(false);

  const updateSettlement = (input: Partial<BaseSettlement>) => {
    setSettlement({
      ...settlement,
      ...input,
    } as BaseSettlement)
  }

  const submitData = async () => {
    setLoading(true);
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
    setLoading(false);
  }

  const getSettlement = async () => {
    setLoading(true);
    setSettlement(await callAPI({ type: 'getSettlement', payload: { where: { id: settlement.id } } }));
    setLoading(false);
    console.log(settlement.location)
  }

  const deleteSettlement = async (id: string, name: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteSettlement', payload: { where: { id }, data: { name } } });
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
      <Container>
        <Container>
          <Box>
            <>
              <div className='align-middle'>
                <Headline type='h1' className='inline-block'>
                  <InputGhost
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateSettlement({ name: event.target.value })}
                    value={settlement.name} />
                </Headline>
                {loading ? (
                  <div className='inline-block pb-1'>
                    <Loader2Icon className='animate-spin' />
                  </div>
                ) : (
                  <TagList key={Object.keys(settlement.tags).length} className='ml-2 align-top' existingTags={settlement.tags} removeTag={removeTag} addTag={addTag} />
                )}
              </div>
              <div>
                <TextareaGhost
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => updateSettlement({ description: event.target.value })}
                  value={settlement.description} />
              </div>
            </>
          </Box>
        </Container>
        <Container cols="grid-cols-1 md:grid-cols-2">
          <>
            {settlement.events.length > 0 && (
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Historie</Headline>
                <Timeline
                  events={settlement.events} />
              </Box>
            )}
            {settlement.details.length > 0 && (
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Details</Headline>
                <DetailsList details={settlement.details} />
              </Box>
            )}
          </>
        </Container>
        <Container>
          <>
            {settlement.architects.length > 0 && (
              <Box>
                <>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    {settlement.architects.length > 1 ? 'Architekten' : 'Architekt'}
                  </Headline>
                  {settlement.architects.map((architect: Architect) => (
                    <div key={architect.id}>
                      {architect.name}
                    </div>
                  ))}
                </>
              </Box>
            )}
          </>
        </Container>
        <Container cols='md:grid-cols-2'>
          <>
            {settlement.resources.length > 0 && (
              <>
                {settlement.resources.filter(resource => resource.type.name === 'Foto').map((resource) => (
                  <Box key={resource.id} className="py-3 md:p-0 h-60 lg:h-96 justify-between">
                    <div className='bg-grey-light grow flex items-center overflow-hidden mb-1 md:mb-0'>
                      <img src={resource.url} alt={resource.description} loading='lazy' />
                    </div>
                    <div className='md:px-5 pt-2 md:pt-4 md:pb-4'>
                      {resource.description}
                    </div>
                  </Box>
                ))}
              </>
            )}
          </>
        </Container>
        <>
          {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
            <Container>
              <Map key={`${settlement.location.lat}${settlement.location.lng}`} lat={settlement.location.lat} lng={settlement.location.lng} />
            </Container>
          )}
          <Box>
            <Location settlement={settlement} onUpdate={getSettlement} />
          </Box>
        </>
      </Container>
      <Container cols='grid-cols-2'>
        <Button onClick={submitData} disabled={loading}><>Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</></Button>
        <Button onClick={() => deleteSettlement(settlement.id, settlement.name)} disabled={loading}><>Löschen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none bg-red' />}</></Button>
        <Link href='/admin/siedlungen' className='inline-block py-1 px-3 bg-content text-center'>Abbrechen</Link>
      </Container>
    </>
  );
}