'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

import type { CesiumType } from '@/types/cesium';
import type { Position } from '@/types/position';

const CesiumDynamicComponent = dynamic(() => import('./CesiumComponent'), {
  ssr: false
});

export const CesiumWrapper: React.FunctionComponent<{
  position: Position
}> = ({
  position,
}) => {
    const [cesiumJs, setCesiumJs] = React.useState<CesiumType | null>(null);
    useEffect(() => {

      // if (typeof document !== "undefined") {
      //   window.scrollTo({ top: 140 });
      // }
    }, []);


    React.useEffect(() => {
      if (cesiumJs !== null) return;
      const CesiumImportPromise = import('cesium');
      Promise.all([CesiumImportPromise]).then((promiseResults) => {
        const { ...Cesium } = promiseResults[0];
        setCesiumJs(Cesium);
      });
    }, [cesiumJs]);

    return (
      cesiumJs ? <>
        <CesiumDynamicComponent CesiumJs={cesiumJs} position={position} isRotating />
      </> : null
    );
  };

export default CesiumWrapper;