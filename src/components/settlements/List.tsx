import { Button, List, ListItem } from '@material-tailwind/react';
import { RotateCwIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

export function ListSettlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  useEffect(() => {
    getSettlements();
  }, [])

  return (
    <>
      <div className='mt-4'>
        <h1 className='inline-block'>Siedlungen in Deutschland</h1>
        <Button size='sm' className='ml-3' onClick={() => getSettlements()}><RotateCwIcon className='align-text-bottom' size={18} /></Button>
      </div>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && settlements ? (
          <List>
            {settlements.map(({ title, id }) => (
              <ListItem key={id} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>
                  <Link href={`/admin/settlements/${id}`}>{title}</Link>
                </Skeleton>
              </ListItem>
            ))}
          </List>
        ) : settlements ? (
          <List>
            {settlements.map(({ title, id }) => (
              <ListItem key={id}>
                <Link href={`/admin/settlements/${id}`}>{title}</Link>
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
