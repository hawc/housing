import { Loader2Icon, RotateCwIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

import { BaseTag, Tag } from '@/pages/admin';

function AddTag({ getTags }: { getTags: () => Promise<void> }) {
  const [currentTag, setCurrentTag] = useState<Partial<Tag>>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const setTag = (newTag: Partial<Tag>) => {
    setCurrentTag({
      ...currentTag,
      ...newTag
    });
  }

  const submitTag = async (tag: Partial<Tag>) => {
    setLoading(true);
    await callAPI({ type: 'addTag', payload: { data: tag } });
    await getTags();
    setLoading(false);
  };

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost placeholder='Neuer Tag' value={currentTag.name} onChange={(e) => setTag({ name: e.target.value })} className='mb-1' />
        </Headline>
      </div>
      <TextareaGhost placeholder='Beschreibung' value={currentTag.description} onChange={(e) => setTag({ description: e.target.value })} />
      <Button disabled={loading} onClick={() => submitTag(currentTag)}>
        <>Tag hinzufügen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
      </Button>
    </>
  );
}

export function EditTag({ tag, getTags }: { tag: BaseTag, getTags: () => Promise<void> }) {
  const [currentTag, setCurrentTag] = useState<BaseTag>(tag);
  const [loading, setLoading] = useState<boolean>(false);

  const updateTag = (updatedTag) => {
    setCurrentTag({
      ...currentTag,
      ...updatedTag
    });
  }

  const deleteTag = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteTag', payload: { where: { id } } });
    await getTags();
    setLoading(false);
  };

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost value={tag.name} onChange={(e) => updateTag({ name: e.name })} className='mb-1' />
        </Headline>
        <Button disabled={loading} onClick={() => deleteTag(tag.id)} className='ml-3 p-2 rounded-full'>
          <>{loading ? <Loader2Icon size={15} className='animate-spin' /> : <XIcon size={15} />}</>
        </Button>
      </div>
      <TextareaGhost value={tag.description} onChange={(e) => updateTag({ description: e.description })} />
    </>
  );
}

export function ListTags({ tagsInput }: { tagsInput: BaseTag[] }) {
  const [tags, setTags] = useState<BaseTag[]>(tagsInput);
  const [loading, setLoading] = useState(false);

  const getTags = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const tags = await callAPI({ type: 'getTags' });
    setTags(tags);
    setLoading(false);
  };

  return (
    <>
      <Container>
        <Box>
          <div className='flex'>
            <Headline type='h1' className='mb-0 inline-block'>Tags: Übersicht</Headline>
            <Button className='ml-3 p-2 rounded-full' onClick={() => getTags()}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </Box>
        <Container cols='grid-cols-2'>
          <>
            {tags.sort((tagA, tagB) => tagA.name.localeCompare(tagB.name)).map((tag: BaseTag) => (
              <Box key={tag.id}>
                <EditTag tag={tag} getTags={getTags} />
              </Box>
            ))}
          </>
          <Box>
            <AddTag key={tags.length} getTags={getTags} />
          </Box>
        </Container>
      </Container>
    </>
  );
}
