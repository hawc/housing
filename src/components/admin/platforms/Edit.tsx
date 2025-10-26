import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { TextareaGhost } from '@/components/common/form/Textarea';
import { Headline } from '@/components/Headline';
import { fetchData } from '@/lib/fetch';
import { Platform } from '@/lib/types';
import { Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

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
      ...updatedPlatform,
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
    await fetchData(`/api/platforms/update/${platform.id}`, undefined, {
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
            value={platform.name}
            onChange={(event) => updatePlatform({ name: event.target.value })}
            className='mb-1'
          />
        </Headline>
        <Button
          disabled={loading}
          onClick={() => deletePlatform(platform.id)}
          className='ml-3 p-2 rounded-full'
        >
          {loading ? (
            <Loader2Icon size={15} className='animate-spin' />
          ) : (
            <XIcon size={15} />
          )}
        </Button>
      </div>
      <InputGhost
        value={platform.url}
        onChange={(event) => updatePlatform({ url: event.target.value })}
        className='mb-1'
      />
      <InputGhost
        placeholder='URL-Matcher'
        value={platform.urlIdentifier}
        onChange={(event) =>
          updatePlatform({ urlIdentifier: event.target.value })
        }
        className='mb-1'
      />
      <TextareaGhost
        value={platform.description}
        onChange={(event) =>
          updatePlatform({ description: event.target.value })
        }
        className='mb-1'
      />
      <Button loading={loading} onClick={() => submitPlatform(currentPlatform)}>
        Plattform speichern
      </Button>
    </>
  );
}
