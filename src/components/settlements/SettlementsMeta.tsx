'use client';

import { Loader2Icon, MapPinIcon } from 'lucide-react';
import { useCallback, useContext } from 'react';

import { SettingsContext } from '@/lib/settingsContext';
import type { Location } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';

interface SettlementsMetaProps {
  location: Location | null;
}

export function SettlementMeta({ location }: SettlementsMetaProps) {
  const { enable3D, setEnable3D, is3DLoading } = useContext(SettingsContext);

  const setTopView = useCallback(() => {
    setEnable3D(!enable3D);
  }, [setEnable3D, enable3D]);

  return (
    <>
      <div className='flex flex-row gap-1 items-center'><MapPinIcon /> {location?.city}</div>
      <Button ghost className='rounded-full px-2 hidden md:block' onClick={setTopView} disabled={is3DLoading}>
        {is3DLoading ? (
          <div className='flex gap-1'>3D-Ansicht lädt <Loader2Icon className='h-6 self-center animate-spin' /></div>
        ) : enable3D ? '3D-Ansicht schließen' : '3D-Ansicht öffnen'}
      </Button>
    </>
  );
}