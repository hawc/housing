import { Button, Input, List, ListItem } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

function AddLocation({ getLocations }: { getLocations: () => Promise<void> | void }) {
  const [location, setLocation] = useState<string | null>(null);

  const addLocation = async (locationName: string) => {
    if (!locationName) {
      return console.error('No name provided');
    }
    await callAPI({ type: 'addLocation', payload: { data: { name: locationName } } });
    await getLocations();
  };

  return (
    <>
      <div>
        <Input
          label='New Location Name'
          className='pr-20'
          containerProps={{
            className: 'min-w-0',
          }}
          value={location ?? ''}
          onChange={({ target }) => setLocation(target.value)} />
        <Button
          size='sm'
          className='ml-2 right-1 top-1 rounded'
          onClick={() => location && addLocation(location)}>Add</Button>
      </div></>
  );
}

export function ListLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLocations = async () => {
    setLoading(true);
    const locations = await callAPI({ type: 'getLocations' });
    setLocations(locations);
    setLoading(false);
  };

  const deleteLocation = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteLocation', payload: { where: { id } } });
    getLocations();
    setLoading(false);
  };

  useEffect(() => {
    getLocations();
  }, [])

  return (
    <>
      <h1>Show locations</h1>
      <Button onClick={() => getLocations()}>Button</Button>
      <div className='relative flex w-full max-w-[24rem]'>
        {loading && locations ? (
          <List>
            {locations.map(({ name, id }) => (
              <ListItem key={id} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>{id}: {name}
                  <Button
                    disabled
                    size='sm'
                    className='ml-2 right-1 top-1 rounded'
                  >Delete</Button></Skeleton>
              </ListItem>
            ))}
            <ListItem className={skeletonClass} style={skeletonStyle}>
              <Skeleton nested>
                <AddLocation getLocations={() => { return }} />
              </Skeleton>
            </ListItem>
          </List>
        ) : locations ? (
          <List>
            {locations.map(({ name, id }) => (
              <ListItem key={id}>{id}: {name}
                <Button
                  size='sm'
                  className='ml-2 right-1 top-1 rounded'
                  onClick={() => deleteLocation(id)}>Delete</Button></ListItem>
            ))}
            <ListItem>
              <AddLocation getLocations={() => getLocations()} />
            </ListItem>
          </List>
        ) : (
          <>Couldn't load locations.</>
        )}
      </div >
    </>
  );
}
