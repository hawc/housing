'use client';

import type { BoundingSphere, Cesium3DTileset, Viewer } from 'cesium';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

// This is required to get the stylings for default Cesium UI and controls
import 'cesium/Build/Cesium/Widgets/widgets.css';

import { SettingsContext } from '@/lib/settingsContext';

import { Coordinates } from '@/components/settlements/Map';

import type { CesiumType } from '@/types/cesium';

interface CesiumComponentProps {
  CesiumJs: CesiumType,
  position: Coordinates,
  isRotating,
}

function CesiumComponent({
  CesiumJs,
  position,
  isRotating,
}: CesiumComponentProps) {
  const { setIs3DLoading, setEnable3D } = useContext(SettingsContext);
  const cesiumViewer = useRef<Viewer | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const addedScenePrimitives = useRef<Cesium3DTileset[]>([]);
  const bounding = useRef<BoundingSphere | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const heading = useRef(-CesiumJs.Math.PI_OVER_TWO);
  const removeListener = useRef<undefined | (() => void)>(undefined);

  const cleanUpPrimitives = useCallback(() => {
    // Cleans up potentially already-existing primitives.
    addedScenePrimitives.current.forEach(scenePrimitive => {
      if (cesiumViewer.current !== null) {
        cesiumViewer.current.scene.primitives.remove(scenePrimitive);
      }
    });
    addedScenePrimitives.current = [];
  }, []);

  const initializeCesiumJs = useCallback(async () => {
    if (cesiumViewer.current !== null) {
      cleanUpPrimitives();
      let tileset;
      try {
        tileset = await CesiumJs.Cesium3DTileset.fromIonAssetId(2275207);
      } catch (error) {
        console.error('Could not load tileset.');
        setEnable3D(false);
        setIs3DLoading(false);
        return;
      }
      bounding.current = tileset.boundingSphere;
      const tiles = cesiumViewer.current.scene.primitives.add(tileset);
      addedScenePrimitives.current.push(tiles);

      setIsLoaded(true);
      setTimeout(() => {
        setIs3DLoading(false);
        setIsInitialized(true);
      }, 1000);
    }
  }, [CesiumJs.Cesium3DTileset, cleanUpPrimitives, setEnable3D, setIs3DLoading]);

  useEffect(() => {
    if (cesiumViewer.current === null && cesiumContainerRef.current) {
      CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;

      //NOTE: Always utilize CesiumJs; do not import them from 'cesium'
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
        skyBox: false,
      });

      cesiumViewer.current.clock.clockStep = CesiumJs.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    }
  }, [CesiumJs]);

  useEffect(() => {
    if (isLoaded) {
      return;
    }

    initializeCesiumJs();
  }, [position, isLoaded, initializeCesiumJs]);

  useEffect(() => {
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
              const rotation = -1; //counter-clockwise, +1 would be clockwise
              heading.current = heading.current + rotation * (Math.PI / 2400);
              cesiumViewer.current.camera.lookAt(clampedHeight ?? center, new CesiumJs.HeadingPitchRange(
                heading.current,
                -CesiumJs.Math.PI_OVER_SIX,
                1000.0
              ));
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
      style={{
        minHeight: isInitialized ? 'calc(100px + 1.5rem)' : 0,
        transition: 'opacity 1s, height 1s',
        height: isInitialized ? 'calc(100px + 40vw)' : '100px',
        marginBottom: '-100px'
      }}
      className={isInitialized ? 'opacity-100' : 'opacity-0'}
    />
  );
}

export default CesiumComponent;