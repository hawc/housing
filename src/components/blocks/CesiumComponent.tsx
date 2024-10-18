'use client';

import type { BoundingSphere, Cesium3DTileset, Viewer } from 'cesium';
import React, { useEffect } from 'react';

//NOTE: This is required to get the stylings for default Cesium UI and controls
import 'cesium/Build/Cesium/Widgets/widgets.css';

import type { CesiumType } from '@/types/cesium';
import type { Position } from '@/types/position';

export const CesiumComponent: React.FunctionComponent<{
  CesiumJs: CesiumType,
  position: Position,
  isRotating,
}> = ({
  CesiumJs,
  position,
  isRotating
}) => {
    const cesiumViewer = React.useRef<Viewer | null>(null);
    const cesiumContainerRef = React.useRef<HTMLDivElement>(null);
    const addedScenePrimitives = React.useRef<Cesium3DTileset[]>([]);
    const bounding = React.useRef<BoundingSphere | null>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const heading = React.useRef(-CesiumJs.Math.PI_OVER_TWO);
    const removeListener = React.useRef<undefined | (() => void)>(undefined);

    useEffect(() => {
      if (isInitialized) {
        cesiumContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    }, [isInitialized]);

    const cleanUpPrimitives = React.useCallback(() => {
      // Cleans up potentially already-existing primitives.
      addedScenePrimitives.current.forEach(scenePrimitive => {
        if (cesiumViewer.current !== null) {
          cesiumViewer.current.scene.primitives.remove(scenePrimitive);
        }
      });
      addedScenePrimitives.current = [];
    }, []);

    const initializeCesiumJs = React.useCallback(async () => {
      if (cesiumViewer.current !== null) {
        cleanUpPrimitives();
        let tileset;
        try {
          tileset = await CesiumJs.Cesium3DTileset.fromIonAssetId(2275207);
        } catch (error) {
          console.error('Could not load tileset.');
          return;
        }
        bounding.current = tileset.boundingSphere;
        const tiles = cesiumViewer.current.scene.primitives.add(tileset);
        addedScenePrimitives.current.push(tiles);

        setIsLoaded(true);
        setTimeout(() => {
          setIsInitialized(true);
        }, 1000);
      }
    }, [CesiumJs.Cesium3DTileset, cleanUpPrimitives]);

    React.useEffect(() => {
      if (cesiumViewer.current === null && cesiumContainerRef.current) {
        CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;

        //NOTE: Always utilize CesiumJs; do not import them from "cesium"
        cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
          animation: false,
          baseLayerPicker: false,
          fullscreenElement: cesiumContainerRef.current,
          geocoder: false,
          globe: false,
          homeButton: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          timeline: false,
          creditContainer: 'credits',
        });

        cesiumViewer.current.clock.clockStep = CesiumJs.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      }
    }, [CesiumJs]);

    React.useEffect(() => {
      if (isLoaded) return;
      initializeCesiumJs();

    }, [position, isLoaded, initializeCesiumJs]);

    React.useEffect(() => {
      if (isLoaded) {
        if (removeListener.current) {
          removeListener.current();
        }
        if (cesiumViewer.current !== null) {
          if (isRotating) {
            removeListener.current = cesiumViewer.current.clock.onTick.addEventListener(() => {
              if (cesiumViewer.current?.scene) {
                const center = CesiumJs.Cartesian3.fromDegrees(position.lng, position.lat, 0);
                const clampedHeight = cesiumViewer.current.scene.clampToHeight(center);

                const rotation = -1; //counter-clockwise; +1 would be clockwise
                heading.current = heading.current + rotation * (Math.PI / 2400);
                if (clampedHeight) {
                  cesiumViewer.current.camera.lookAt(clampedHeight, new CesiumJs.HeadingPitchRange(heading.current,
                    -CesiumJs.Math.PI_OVER_SIX,
                    1000.0
                  ));
                }
              }
            });
          }
        }
      }
    }, [isRotating, isLoaded, CesiumJs, position]);

    return (
      <div
        ref={cesiumContainerRef}
        id='cesium-container'
        style={{ transition: 'opacity 1s, height 1s', height: isInitialized ? 'calc(100px + 40vw)' : '100px', marginBottom: '-100px' }}
        className={isInitialized ? 'opacity-100' : 'opacity-0'}
      />
    );
  };

export default CesiumComponent;