import { Chip, Input } from '@material-tailwind/react';
import { useState } from 'react';

import { Headline } from '@/components/Headline';
import Timeline from '@/components/Timeline';

import type { Architect, Detail, Settlement, Tag } from '@/pages/admin';

export function Settlement({ settlement }: { settlement: Settlement }) {
  const [title, setTitle] = useState(settlement.title);

  return (
    <>
      <div>
        <div>
          <div className='align-middle'>
            <h1 className='mb-3 inline-block'><Input value={settlement.title} onChange={(e) => setTitle(e.target.value)} /></h1>
            {settlement.tags.map((tag: Tag, index: number) => (
              <Chip key={index} variant="outlined" size='sm' value={tag.name} className='ml-2 inline-block align-top rounded-full' />
            ))}
          </div>
          <p>{settlement.description}</p>
        </div>
        {settlement.architects.length > 0 && (
          <div>
            <Headline className='inline-block' tag='h2' type='h6'><>Architekt{settlement.architects.length > 1 && (<>en</>)}:&nbsp;</></Headline>
            {settlement.architects.map((architect: Architect, index: number) => (
              <span className='inline-block' key={architect.id}>
                {architect.name}{index < settlement.architects.length - 1 && (<>,&nbsp;</>)}
              </span>
            ))}
          </div>
        )}
        {settlement.events.length > 0 && (
          <div className='mt-4'>
            <h2 className='mb-3'>Events</h2>
            <Timeline events={settlement.events} />
          </div>
        )}
        <div>
          <h2>Details</h2>
          <div>
            {settlement.details?.map((detail: Detail) => (
              <div key={detail.id}>
                <h3>
                  {detail.name}
                </h3>
                <div>
                  {detail.detailType.name}: {detail.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}