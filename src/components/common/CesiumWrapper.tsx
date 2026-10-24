'use client';

import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';

import type { Coordinates } from '@/components/settlements/Map';
import { logger } from '@/lib/logger';
import { SettingsContext } from '@/lib/settingsContext';
import type { CesiumType } from '@/types/cesium';

if (typeof window !== 'undefined') {
  window.CESIUM_BASE_URL = '/cesium';
}

const CesiumContainer = dynamic(
  () => import('./CesiumContainer').then((module) => module.CesiumContainer),
  { ssr: false },
);

interface CesiumWrapperProps {
  position: Coordinates;
}

function CesiumLoader({ position }: CesiumWrapperProps) {
  const { setIs3DLoading } = useContext(SettingsContext);
  const [cesiumJs, setCesiumJs] = useState<CesiumType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    // Publish the external SDK's loading state to the page's open/close button.
    setIs3DLoading(true);
    void import('cesium')
      .then((Cesium) => {
        if (!active) return;
        Cesium.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;
        setCesiumJs(Cesium);
      })
      .catch((error) => {
        if (!active) return;
        logger(error, 'Could not load Cesium.');
        setError(true);
        setIs3DLoading(false);
      });
    return () => {
      active = false;
      setIs3DLoading(false);
    };
  }, [setIs3DLoading]);

  if (error)
    return (
      <p role='alert'>
        Die 3D-Ansicht konnte nicht geladen werden. Bitte schließe sie und öffne
        sie erneut.
      </p>
    );
  if (!cesiumJs)
    return (
      <p role='status' className='py-8 text-center'>
        3D-Ansicht lädt…
      </p>
    );
  return <CesiumContainer CesiumJs={cesiumJs} position={position} />;
}

export function CesiumWrapper({ position }: CesiumWrapperProps) {
  const { enable3D } = useContext(SettingsContext);
  return enable3D ? (
    <CesiumLoader key={`${position.lat}-${position.lng}`} position={position} />
  ) : null;
}
