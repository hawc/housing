import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { TextareaGhost } from '@/components/common/form/Textarea';
import { Headline } from '@/components/Headline';
import { fetchData } from '@/lib/fetch';
import { Platform } from '@/lib/types';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

interface AddPlatformProps {
  getPlatforms: () => Promise<void>;
}

export function AddPlatform({ getPlatforms }: AddPlatformProps) {
  const [currentPlatform, setCurrentPlatform] = useState<Partial<Platform>>({
    name: '',
    description: '',
    url: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  function setPlatform(newPlatform: Partial<Platform>) {
    setCurrentPlatform({
      ...currentPlatform,
      ...newPlatform,
    });
  }

  async function submitPlatform(platform: Partial<Platform>) {
    setLoading(true);
    await fetchData('/api/platforms/add', undefined, {
      method: 'POST',
      body: JSON.stringify(platform),
    });
    await getPlatforms();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost
            placeholder='Neue Plattform'
            value={currentPlatform.name}
            onChange={(event) => setPlatform({ name: event.target.value })}
            className='mb-1'
          />
        </Headline>
      </div>
      <InputGhost
        placeholder='URL'
        value={currentPlatform.url}
        onChange={(event) => setPlatform({ url: event.target.value })}
        className='mb-1'
      />
      <InputGhost
        placeholder='URL-Matcher'
        value={currentPlatform.urlIdentifier}
        onChange={(event) => setPlatform({ urlIdentifier: event.target.value })}
      />
      <TextareaGhost
        placeholder='Beschreibung'
        value={currentPlatform.description}
        onChange={(event) => setPlatform({ description: event.target.value })}
        className='mb-1'
      />
      <Button
        disabled={loading}
        onClick={() => submitPlatform(currentPlatform)}
      >
        <>
          Plattform hinzufügen{' '}
          {loading && (
            <Loader2Icon className='inline-block animate-spin align-sub leading-none' />
          )}
        </>
      </Button>
    </>
  );
}
