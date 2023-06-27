import { Button, Input, List, ListItem } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

function AddSettlement({ getSettlements }: { getSettlements: () => Promise<void> | void }) {
  const [settlement, setSettlement] = useState<string | null>(null);

  const addSettlement = async (settlementName: string) => {
    if (!settlementName) {
      return console.error('No name provided');
    }
    await callAPI({ type: 'addSettlement', payload: { name: settlementName } });
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
          size="sm"
          className="ml-2 right-1 top-1 rounded"
          onClick={() => settlement && addSettlement(settlement)}>Add</Button>
      </div></>
  );
}

export function ListSettlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  const deleteSettlement = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteSettlement', payload: { id } });
    getSettlements();
    setLoading(false);
  };

  useEffect(() => {
    getSettlements();
  }, [])

  return (
    <>
      <h1>Show settlements</h1>
      <Button onClick={() => getSettlements()}>Button</Button>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && settlements ? (
          <List>
            {settlements.map(({ title, id, description }) => (
              <ListItem key={id} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>{id}: {title} {description}
                  <Button
                    disabled
                    size='sm'
                    className="ml-2 right-1 top-1 rounded"
                  >Delete</Button></Skeleton>
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
            {settlements.map(({ title, id, description }) => (
              <ListItem key={id}>{id}: {title} {description}
                <Button
                  size='sm'
                  className="ml-2 right-1 top-1 rounded"
                  onClick={() => deleteSettlement(id)}>Delete</Button></ListItem>
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
