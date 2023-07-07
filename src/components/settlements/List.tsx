import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

import { BaseSettlement } from '@/pages/admin';

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [settlements, setSettlements] = useState(settlementsInput);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  return (
    <>
      <div>
        <Headline type='h1' className='inline-block'>Siedlungen: Übersicht</Headline>
        <Button color='white' className='align-top mt-1 ml-3' onClick={() => getSettlements()}><RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={16} /></Button>
      </div>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && settlements ? (
          <List>
            {settlements.map(({ name, slug }) => (
              <ListItem key={slug} plain className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>
                  <Link href={`/siedlungen/${slug}`}>{name}</Link>
                </Skeleton>
              </ListItem>
            ))}
          </List>
        ) : settlements ? (
          <List>
            {settlements.map(({ name, slug }) => (
              <ListItem plain key={slug}>
                <Link href={`/siedlungen/${slug}`}>{name}</Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <>Couldn't load settlements.</>
        )}
      </div >
    </>
  );
}
