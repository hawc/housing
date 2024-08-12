'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { CesiumType } from '@/types/cesium';
import type { Position } from '@/types/position';

const CesiumDynamicComponent = dynamic(() => import('./CesiumComponent'), {
  ssr: false
});

export const CesiumWrapper: React.FunctionComponent<{
  position: Position
}> = ({
  position
}) => {
    const [CesiumJs, setCesiumJs] = React.useState<CesiumType | null>(null);
    const [autoRotate, setAutoRotate] = React.useState<boolean>(true);

    React.useEffect(() => {
      if (CesiumJs !== null) return;
      const CesiumImportPromise = import('cesium');
      Promise.all([CesiumImportPromise]).then((promiseResults) => {
        const { ...Cesium } = promiseResults[0];
        setCesiumJs(Cesium);
      });
    }, [CesiumJs]);

    return (
      CesiumJs ? <>
        <CesiumDynamicComponent CesiumJs={CesiumJs} position={position} isRotating={autoRotate} />
        <button onClick={() => setAutoRotate(!autoRotate)} type='button'>rotate? {autoRotate}</button>
        <div id="credits"></div>
      </> : null
    );
  };

export default CesiumWrapper;