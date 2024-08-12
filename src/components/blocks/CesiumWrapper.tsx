'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { CesiumType } from '@/types/cesium';
import type { Position } from '@/types/position';

const CesiumDynamicComponent = dynamic(() => import('./CesiumComponent'), {
  ssr: false
});

export const CesiumWrapper: React.FunctionComponent<{
  positions: Position[]
}> = ({
  positions
}) => {
    const [CesiumJs, setCesiumJs] = React.useState<CesiumType | null>(null);
    const [autoRotate, setAutoRotate] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (CesiumJs !== null) return;
      const CesiumImportPromise = import('cesium');
      Promise.all([CesiumImportPromise]).then((promiseResults) => {
        const { ...Cesium } = promiseResults[0];
        setCesiumJs(Cesium);
      });
    }, [CesiumJs]);

    return (
      CesiumJs ? <><CesiumDynamicComponent CesiumJs={CesiumJs} positions={positions} autoRotate={autoRotate} /><button onClick={(e) => setAutoRotate(!autoRotate)} type='button'>rotate? {autoRotate}</button><div id="credits"></div></> : null
    );
  };

export default CesiumWrapper;