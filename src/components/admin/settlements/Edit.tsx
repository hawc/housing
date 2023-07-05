import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Map } from '@/components/admin/settlements/Map';
import { Box, Container } from '@/components/blocks/Box';
import { DetailsList } from '@/components/blocks/DetailsList';
import { InputGhost } from '@/components/blocks/form/Input';
import { TagList } from '@/components/blocks/Tags';
import { Timeline } from '@/components/blocks/Timeline';
import { Headline } from '@/components/Headline';

import type { Architect, BaseSettlement, Tag } from '@/pages/admin';

export type Partial<T> = { [P in keyof T]?: T[P] };

export function SettlementEdit({ settlementInput }: { settlementInput: BaseSettlement }) {
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
          description: settlement.description
        },
        where: { id: settlement.id }
      }
    });
    setSettlement(await callAPI({ type: 'getSettlement', payload: { where: { id: settlement.id } } }));
    setLoading(false);
  }

  return (
    <>
      <Container>
        <Container>
          <Box>
            <>{loading && 'loading'}</>
            <>
              <div className='align-middle'>
                <Headline type="h1" className='inline-block'>
                  <InputGhost
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateSettlement({ name: event.target.value })}
                    value={settlement.name} />
                </Headline>
                {settlement.tags.length > 0 && (
                  <TagList className='ml-2 inline-block align-top' tagNames={settlement.tags.map((tag: Tag) => tag.name)} />
                )}
              </div>
              {settlement.description && (
                <p>
                  <InputGhost
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateSettlement({ description: event.target.value })}
                    value={settlement.description} />
                </p>
              )}
            </>
          </Box>
        </Container>
        <Container cols="grid-cols-1 md:grid-cols-2">
          <>
            {settlement.events.length > 0 && (
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Historie</Headline>
                <Timeline events={settlement.events} />
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
        <div className='columns-2 gap-3 md:gap-5'>
          <>
            {settlement.resources.length > 0 && (
              <>
                {settlement.resources.filter(resource => resource.type.name === 'Foto').map((resource, index) => (
                  <Box key={resource.id} className={index < settlement.resources.filter(resource => resource.type.name === 'Foto').length - 2 ? 'mb-5 p-0 block' : 'p-0 block'}>
                    <img className='block' src={resource.url} alt={resource.description} loading='lazy' />
                    <div className='px-5 py-4'>
                      {resource.description}
                    </div>
                  </Box>
                ))}
              </>
            )}
          </>
        </div>
        <>
          {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
            <Container>
              <Map lat={settlement.location.lat} lng={settlement.location.lng} />
            </Container>
          )}
        </>
      </Container>
      <Container>
        <button onClick={submitData}>Änderungen speichern</button>
      </Container>
    </>
  );
}