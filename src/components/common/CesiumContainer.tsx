'use client';

import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useContext, useEffect, useRef, useState } from 'react';

import type { Coordinates } from '@/components/settlements/Map';
import { SettingsContext } from '@/lib/settingsContext';
import type { CesiumType } from '@/types/cesium';
import { CesiumMapController } from './CesiumMapController';

const prefersReducedMotion = () =>
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

interface CesiumContainerProps {
  CesiumJs: CesiumType;
  position: Coordinates;
}

export function CesiumContainer({ CesiumJs, position }: CesiumContainerProps) {
  const { setIs3DLoading } = useContext(SettingsContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useRef<CesiumMapController | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [rotating, setRotating] = useState(() => !prefersReducedMotion());
  const rotation = useRef(rotating);

  useEffect(() => {
    if (!containerRef.current) return;
    const controller = new CesiumMapController(
      CesiumJs,
      containerRef.current,
      { lat: position.lat, lng: position.lng },
      rotation.current,
      {
        onReady: () => {
          setReady(true);
          setIs3DLoading(false);
        },
        onError: () => {
          setError(
            'Die 3D-Ansicht konnte nicht geladen werden. Bitte schließe sie und öffne sie erneut.',
          );
          setIs3DLoading(false);
        },
      },
    );
    controls.current = controller;
    return () => {
      controller.destroy();
      controls.current = null;
    };
  }, [CesiumJs, position.lat, position.lng, setIs3DLoading]);

  useEffect(() => {
    rotation.current = rotating;
    controls.current?.setRotating(rotating);
  }, [rotating]);

  return (
    <section
      className='relative'
      aria-label='3D-Karte der Siedlung'
      aria-busy={!ready && !error}
    >
      <div
        ref={containerRef}
        className={`transition-opacity duration-500 -mb-16 ${ready ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ height: 'clamp(420px, 50vw, 720px)' }}
      />
      {!ready && !error && (
        <p
          role='status'
          className='absolute inset-0 flex items-center justify-center'
        >
          3D-Ansicht lädt…
        </p>
      )}
      {error && (
        <p
          role='alert'
          className='absolute inset-0 flex items-center justify-center p-4'
        >
          {error}
        </p>
      )}
      {ready && (
        <div className='absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2'>
          <div
            className='flex flex-wrap gap-2'
            role='group'
            aria-label='3D-Kartensteuerung'
          >
            <button
              type='button'
              className='border border-text px-3 py-1 bg-bg'
              onClick={() => setRotating(!rotating)}
              aria-pressed={rotating}
            >
              {rotating ? 'Rundflug pausieren' : 'Rundflug fortsetzen'}
            </button>
            <button
              type='button'
              className='border border-text px-3 py-1 bg-bg'
              aria-label='Vergrößern'
              onClick={() => controls.current?.zoom(0.8)}
            >
              +
            </button>
            <button
              type='button'
              className='border border-text px-3 py-1 bg-bg'
              aria-label='Verkleinern'
              onClick={() => controls.current?.zoom(1.25)}
            >
              −
            </button>
            <button
              type='button'
              className='border border-text px-3 py-1 bg-bg'
              onClick={() => controls.current?.reset()}
            >
              Siedlung zentrieren
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
