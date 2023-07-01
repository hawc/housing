import { Button } from '@material-tailwind/react';
import { RotateCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

export function ListSettlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  useEffect(() => {
    getSettlements();
  }, [])

  return (
    <>
      <div>
        <Headline type='h1' className='inline-block'>Siedlungen: Übersicht</Headline>
        <Button size='sm' color='white' className='align-top mt-1 ml-3' onClick={() => getSettlements()}><RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={16} /></Button>
      </div>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && settlements ? (
          <List>
            {settlements.map(({ title, id }) => (
              <ListItem key={id} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>
                  <Link href={`/settlements/${id}`}>{title}</Link>
                </Skeleton>
              </ListItem>
            ))}
          </List>
        ) : settlements ? (
          <List>
            {settlements.map(({ title, id }) => (
              <ListItem key={id}>
                <Link href={`/settlements/${id}`}>{title}</Link>
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
