import { Input, List, ListItem } from '@material-tailwind/react';
import { RotateCwIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

import { BaseSettlement, Settlement } from '@/pages/admin';

function AddSettlement({ getSettlements }: { getSettlements: () => Promise<void> | void }) {
  const [settlement, setSettlement] = useState<string | null>(null);

  const addSettlement = async (settlementName: string) => {
    if (!settlementName) {
      return console.error('No name provided');
    }
    await callAPI({
      type: 'addSettlement',
      payload: {
        data: {
          name: settlementName
        }
      }
    });
    await getSettlements();
  };

  return (
    <>
      <div>
        <Input
          label='New Settlement Name'
          className="pr-20"
          containerProps={{
            className: 'min-w-0',
          }}
          value={settlement ?? ''}
          onChange={({ target }) => setSettlement(target.value)} />
        <Button
          className="ml-2 right-1 top-1 rounded"
          onClick={() => settlement && addSettlement(settlement)}>Add</Button>
      </div></>
  );
}

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [settlements, setSettlements] = useState<Settlement[]>(settlementsInput);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  const deleteSettlement = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteSettlement', payload: { where: { id } } });
    getSettlements();
    setLoading(false);
  };

  return (
    <>
      <div className='mt-4'>
        <h1 className='inline-block'>Siedlungen: Übersicht</h1>
        <Button className='align-top mt-1 ml-3' onClick={() => getSettlements()}><RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} /></Button>
      </div>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && settlements ? (
          <List>
            {settlements.map(({ name, slug }) => (
              <ListItem key={slug} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>
                  <Link href={`/admin/siedlungen/${slug}`}>{name}</Link>
                  <Button
                    disabled
                    className="ml-2 right-1 top-1 rounded"
                  >Bearbeiten</Button></Skeleton>
              </ListItem>
            ))}
            <ListItem className={skeletonClass} style={skeletonStyle}>
              <Skeleton nested>
                <AddSettlement getSettlements={() => { return }} />
              </Skeleton>
            </ListItem>
          </List>
        ) : settlements ? (
          <List>
            {settlements.map(({ id, name, slug }) => (
              <ListItem key={slug}>
                <Link href={`/admin/siedlungen/${slug}`}>{name}</Link>
                <Button

                  className="ml-2 right-1 top-1 rounded"
                  onClick={() => deleteSettlement(id)}>Löschen</Button>
              </ListItem>
            ))}
            <ListItem>
              <AddSettlement getSettlements={() => getSettlements()} />
            </ListItem>
          </List>
        ) : (
          <>Couldn't load settlements.</>
        )}
      </div >
    </>
  );
}
