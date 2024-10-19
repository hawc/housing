'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { SettingsContext } from '@/lib/settingsContext';

import type { CesiumType } from '@/types/cesium';
import type { Position } from '@/types/position';

const CesiumDynamicComponent = dynamic(() => import('./CesiumComponent'), {
  ssr: false,
});

interface CesiumWrapperProps {
  position: Position;
}

export function CesiumWrapper({ position }: CesiumWrapperProps) {
  const { enable3D, setIs3DLoading } = useContext(SettingsContext);
  const [cesiumJs, setCesiumJs] = useState<CesiumType | null>(null);

  const loadCesium = useCallback(() => {
    if (cesiumJs) {
      return;
    }

    setIs3DLoading(true);

    const CesiumImportPromise = import('cesium');
    Promise.all([CesiumImportPromise]).then((promiseResults) => {
      const { ...Cesium } = promiseResults[0];
      setCesiumJs(Cesium);
    });
  }, [cesiumJs, setCesiumJs, setIs3DLoading]);

  useEffect(() => {
    if (enable3D) {
      loadCesium();
    } else {
      setCesiumJs(null);
    }
  }, [enable3D, loadCesium, setCesiumJs]);

  return (
    cesiumJs &&
    <CesiumDynamicComponent
      CesiumJs={cesiumJs}
      position={position}
      isRotating
    />
  );
}
