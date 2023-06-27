import { Button, Input, List, ListItem } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

function AddResource({ getResources }: { getResources: () => Promise<void> | void }) {
  const [resource, setResource] = useState<string | null>(null);

  const addResource = async (resourceName: string) => {
    if (!resourceName) {
      return console.error('No name provided');
    }
    await callAPI({ type: 'addResource', payload: { name: resourceName } });
    await getResources();
  };

  return (
    <>
      <div>
        <Input
          label='New Resource Name'
          className="pr-20"
          containerProps={{
            className: 'min-w-0',
          }}
          value={resource ?? ''}
          onChange={({ target }) => setResource(target.value)} />
        <Button
          size="sm"
          className="ml-2 right-1 top-1 rounded"
          onClick={() => resource && addResource(resource)}>Add</Button>
      </div></>
  );
}
function AddResourceType({ getResourceTypes }: { getResourceTypes: () => Promise<void> | void }) {
  const [resourceType, setResourceType] = useState<string | null>(null);

  const addResourceType = async (resourceTypeName: string) => {
    if (!resourceTypeName) {
      return console.error('No name provided');
    }
    await callAPI({ type: 'addResourceType', payload: { name: resourceTypeName } });
    await getResourceTypes();
  };

  return (
    <>
      <div>
        <Input
          label='New Resource Type Name'
          className="pr-20"
          containerProps={{
            className: 'min-w-0',
          }}
          value={resourceType ?? ''}
          onChange={({ target }) => setResourceType(target.value)} />
        <Button
          size="sm"
          className="ml-2 right-1 top-1 rounded"
          onClick={() => resourceType && addResourceType(resourceType)}>Add</Button>
      </div></>
  );
}

export function ListResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const getResources = async () => {
    setLoading(true);
    const resources = await callAPI({ type: 'getResources' });
    setResources(resources);
    setLoading(false);
  };
  const getResourceTypes = async () => {
    setLoading(true);
    const resourceTypes = await callAPI({ type: 'getResourceTypes' });
    setResources(resourceTypes);
    setLoading(false);
  };

  const deleteResource = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteResource', payload: { id } });
    getResources();
    setLoading(false);
  };

  useEffect(() => {
    getResources();
  }, [])

  return (
    <>
      <h1>Show resources</h1>
      <Button onClick={() => getResources()}>Button</Button>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && resources ? (
          <List>
            {resources.map(({ name, id }) => (
              <ListItem key={id} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>{id}: {name}
                  <Button
                    disabled
                    size='sm'
                    className="ml-2 right-1 top-1 rounded"
                  >Delete</Button></Skeleton>
              </ListItem>
            ))}
            <ListItem className={skeletonClass} style={skeletonStyle}>
              <Skeleton nested>
                <AddResource getResources={() => { return }} />
              </Skeleton>
            </ListItem>
          </List>
        ) : resources ? (
          <List>
            {resources.map(({ name, id }) => (
              <ListItem key={id}>{id}: {name}
                <Button
                  size='sm'
                  className="ml-2 right-1 top-1 rounded"
                  onClick={() => deleteResource(id)}>Delete</Button></ListItem>
            ))}
            <ListItem>
              <AddResource getResources={() => getResources()} />
              <AddResourceType getResourceTypes={() => getResourceTypes()} />
            </ListItem>
          </List>
        ) : (
          <>Couldn't load resources.</>
        )}
      </div >
    </>
  );
}
