import { Map } from '@/components/admin/settlements/Map';
import { Box, Container } from '@/components/blocks/Box';
import { DetailsList } from '@/components/blocks/DetailsList';
import { Link } from '@/components/blocks/Link';
import { TagList } from '@/components/blocks/Tags';
import { Timeline } from '@/components/blocks/Timeline';
import { Headline } from '@/components/Headline';

import type { Architect, BaseSettlement, Settlement } from '@/pages/admin';

export function Settlement({ settlement }: { settlement: BaseSettlement }) {
  return (
    <>
      <Container>
        <Container>
          <Box>
            <>
              <div className='align-middle'>
                <Headline type="h1" className='inline-block mb-4'>{settlement.name}</Headline>
                {settlement.tags.length > 0 && (
                  <TagList className='ml-2 align-top' tags={settlement.tags} />
                )}
              </div>
              {settlement.description && (
                <p dangerouslySetInnerHTML={{ __html: settlement.description }}></p>
              )}
            </>
          </Box>
        </Container>
        {(settlement.events.length > 0 || settlement.details.length > 0) && (
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
        )}
        {settlement.architects.length > 0 && (
          <Container>
            <Box>
              <>
                <Headline className='inline-block' tag='h2' type='h3'>
                  {settlement.architects.length > 1 ? 'Architekten' : 'Architekt'}
                </Headline>
                {settlement.architects.map((architect: Architect) => (
                  <div key={architect.id}>
                    {architect.description.length > 0 ? (
                      <Link href={`/architekten/${architect.slug}`} arrow>{architect.name}</Link>
                    ) : (
                      <>{architect.name}</>
                    )}
                  </div>
                ))}
              </>
            </Box>
          </Container>
        )}
        {settlement.resources.length > 0 && (
          <Container cols='md:grid-cols-2'>
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
          </Container>
        )}
        <>
          {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
            <Container>
              <Map lat={settlement.location.lat} lng={settlement.location.lng} />
            </Container>
          )}
        </>
      </Container>
    </>
  );
}