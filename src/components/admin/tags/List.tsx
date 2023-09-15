'use client';

import { Loader2Icon, RotateCwIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { sortAlphabetically } from '@/lib/utils';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

import { BaseTag, Tag } from '@/app/admin/page';

async function addTag(data: Partial<Tag>) {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/tags/add`, { method: 'POST', body: JSON.stringify(data) });
  const responseTag = await response.json();

  return responseTag;
}

function AddTag({ getTags }: { getTags: () => Promise<void> }) {
  const [currentTag, setCurrentTag] = useState<Partial<Tag>>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  function setTag(newTag: Partial<Tag>) {
    setCurrentTag({
      ...currentTag,
      ...newTag
    });
  }

  async function submitTag(tag: Partial<Tag>) {
    setLoading(true);
    await addTag(tag);
    await getTags();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost placeholder='Neuer Tag' value={currentTag.name} onChange={(event) => setTag({ name: event.target.value })} className='mb-1' />
        </Headline>
      </div>
      <TextareaGhost placeholder='Beschreibung' value={currentTag.description} onChange={(event) => setTag({ description: event.target.value })} />
      <Button disabled={loading} onClick={() => submitTag(currentTag)}>
        <>Tag hinzufügen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
      </Button>
    </>
  );
}

interface EditTagProps {
  tag: BaseTag;
  getTags: () => Promise<void>;
}

export function EditTag({ tag, getTags }: EditTagProps) {
  const [currentTag, setCurrentTag] = useState<BaseTag>(tag);
  const [loading, setLoading] = useState<boolean>(false);

  function updateTag(updatedTag: Partial<Tag>) {
    setCurrentTag({
      ...currentTag,
      ...updatedTag
    });
  }

  async function deleteTag(id: string) {
    setLoading(true);
    await fetch(`${process.env.BASE_URL ?? ''}/api/locations/delete/${id}`, { method: 'GET' });
    await getTags();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost value={tag.name} onChange={(event) => updateTag({ name: event.target.value })} className='mb-1' />
        </Headline>
        <Button disabled={loading} onClick={() => deleteTag(tag.id)} className='ml-3 p-2 rounded-full'>
          <>{loading ? <Loader2Icon size={15} className='animate-spin' /> : <XIcon size={15} />}</>
        </Button>
      </div>
      <TextareaGhost value={tag.description} onChange={(event) => updateTag({ description: event.target.value })} />
    </>
  );
}

interface ListTagsProps {
  tagsInput: BaseTag[]
}

export function ListTags({ tagsInput }: ListTagsProps) {
  const [tags, setTags] = useState<BaseTag[]>(tagsInput);
  const [loading, setLoading] = useState(false);

  async function getTags() {
    setLoading(true);
    await fetch(`${process.env.BASE_URL ?? ''}/api/cache/clear`);
    const response = await fetch(`${process.env.BASE_URL ?? ''}/api/tags/get/all`, { method: 'GET' });
    const tags: BaseTag[] = await response.json();
    setTags(tags);
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Tags</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={getTags}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Container className='grid-cols-2'>
        <>
          {sortAlphabetically(tags).map((tag: BaseTag) => (
            <Box key={tag.id}>
              <EditTag tag={tag} getTags={getTags} />
            </Box>
          ))}
        </>
        <Box>
          <AddTag key={tags.length} getTags={getTags} />
        </Box>
      </Container>
    </>
  );
}
