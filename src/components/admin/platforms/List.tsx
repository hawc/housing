'use client';

import { Loader2Icon, RotateCwIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Platform } from '@/lib/types';
import { sortAlphabetically } from '@/lib/utils';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';


function AddPlatform({ getPlatforms }: { getPlatforms: () => Promise<void> }) {
  const [currentPlatform, setCurrentPlatform] = useState<Partial<Platform>>({
    name: '',
    description: '',
    url: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  function setPlatform(newPlatform: Partial<Platform>) {
    setCurrentPlatform({
      ...currentPlatform,
      ...newPlatform
    });
  }

  async function submitPlatform(platform: Partial<Platform>) {
    setLoading(true);
    await fetchData('/api/platforms/add', undefined, { method: 'POST', body: JSON.stringify(platform) });
    await getPlatforms();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost placeholder='Neue Plattform' value={currentPlatform.name} onChange={(event) => setPlatform({ name: event.target.value })} className='mb-1' />
        </Headline>
      </div>
      <InputGhost placeholder='URL' value={currentPlatform.url} onChange={(event) => setPlatform({ url: event.target.value })} className='mb-1' />
      <InputGhost placeholder='URL-Matcher' value={currentPlatform.urlIdentifier} onChange={(event) => setPlatform({ urlIdentifier: event.target.value })} />
      <TextareaGhost placeholder='Beschreibung' value={currentPlatform.description} onChange={(event) => setPlatform({ description: event.target.value })} className='mb-1' />
      <Button disabled={loading} onClick={() => submitPlatform(currentPlatform)}>
        <>Plattform hinzufügen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
      </Button>
    </>
  );
}

interface EditPlatformProps {
  platform: Platform;
  getPlatforms: () => Promise<void>;
}

export function EditPlatform({ platform, getPlatforms }: EditPlatformProps) {
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(platform);
  const [loading, setLoading] = useState<boolean>(false);

  function updatePlatform(updatedPlatform: Partial<Platform>) {
    setCurrentPlatform({
      ...currentPlatform,
      ...updatedPlatform
    });
  }

  async function deletePlatform(id: string) {
    setLoading(true);
    await fetchData(`/api/locations/delete/${id}`);
    await getPlatforms();
    setLoading(false);
  }

  async function submitPlatform(platform: Partial<Platform>) {
    setLoading(true);
    await fetchData(`/api/platforms/update/${platform.id}`, undefined, { method: 'POST', body: JSON.stringify(platform) });
    await getPlatforms();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost value={platform.name} onChange={(event) => updatePlatform({ name: event.target.value })} className='mb-1' />
        </Headline>
        <Button disabled={loading} onClick={() => deletePlatform(platform.id)} className='ml-3 p-2 rounded-full'>
          {loading ? <Loader2Icon size={15} className='animate-spin' /> : <XIcon size={15} />}
        </Button>
      </div>
      <InputGhost value={platform.url} onChange={(event) => updatePlatform({ url: event.target.value })} className='mb-1' />
      <InputGhost placeholder='URL-Matcher' value={platform.urlIdentifier} onChange={(event) => updatePlatform({ urlIdentifier: event.target.value })} className='mb-1' />
      <TextareaGhost value={platform.description} onChange={(event) => updatePlatform({ description: event.target.value })} className='mb-1' />
      <Button disabled={loading} onClick={() => submitPlatform(currentPlatform)}>
        <>Plattform speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</>
      </Button>
    </>
  );
}

interface ListPlatformsProps {
  platformsInput: Platform[]
}

export function ListPlatforms({ platformsInput }: ListPlatformsProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(platformsInput);
  const [loading, setLoading] = useState(false);

  async function getPlatforms() {
    setLoading(true);
    await fetchData('/api/cache/clear');
    const platforms = await fetchData<Platform[], Platform[]>('/api/platforms/get/all', []);
    setPlatforms(platforms);
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='mb-0 inline-block'>Plattformen</Headline>
          <div>
            <Button className='ml-3 p-2 rounded-full' onClick={getPlatforms}>
              <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
            </Button>
          </div>
        </div>
      </Box>
      <Container className='grid-cols-2'>
        {sortAlphabetically(platforms).map((platform: Platform) => (
          <Box key={platform.id}>
            <EditPlatform platform={platform} getPlatforms={getPlatforms} />
          </Box>
        ))}
        <Box>
          <AddPlatform key={platforms.length} getPlatforms={getPlatforms} />
        </Box>
      </Container>
    </>
  );
}
