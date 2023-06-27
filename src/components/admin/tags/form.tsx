import { Button, Input, List, ListItem } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

function AddTag({ getTags }: { getTags: () => Promise<void> | void }) {
  const [tag, setTag] = useState<string | null>(null);

  const addTag = async (tagName: string) => {
    if (!tagName) {
      return console.error('No name provided');
    }
    await callAPI({ type: 'addTag', payload: { name: tagName } });
    await getTags();
  };

  return (
    <>
      <div>
        <Input
          label='New Tag Name'
          className="pr-20"
          containerProps={{
            className: 'min-w-0',
          }}
          value={tag ?? ''}
          onChange={({ target }) => setTag(target.value)} />
        <Button
          size="sm"
          className="ml-2 right-1 top-1 rounded"
          onClick={() => tag && addTag(tag)}>Add</Button>
      </div></>
  );
}

export function ListTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTags = async () => {
    setLoading(true);
    const tags = await callAPI({ type: 'getTags' });
    setTags(tags);
    setLoading(false);
  };

  const deleteTag = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteTag', payload: { id } });
    getTags();
    setLoading(false);
  };

  useEffect(() => {
    getTags();
  }, [])

  return (
    <>
      <h1>Show tags</h1>
      <Button onClick={() => getTags()}>Button</Button>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && tags ? (
          <List>
            {tags.map(({ name, id }) => (
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
                <AddTag getTags={() => { return }} />
              </Skeleton>
            </ListItem>
          </List>
        ) : tags ? (
          <List>
            {tags.map(({ name, id }) => (
              <ListItem key={id}>{id}: {name}
                <Button
                  size='sm'
                  className="ml-2 right-1 top-1 rounded"
                  onClick={() => deleteTag(id)}>Delete</Button></ListItem>
            ))}
            <ListItem>
              <AddTag getTags={() => getTags()} />
            </ListItem>
          </List>
        ) : (
          <>Couldn't load tags.</>
        )}
      </div >
    </>
  );
}
