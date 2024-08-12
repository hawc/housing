'use client';

import type { BoundingSphere, Cesium3DTileset, Primitive } from 'cesium';
import { type Viewer } from 'cesium';
import React from 'react';

//NOTE: This is required to get the stylings for default Cesium UI and controls
import 'cesium/Build/Cesium/Widgets/widgets.css';

import type { CesiumType } from '@/types/cesium';
import type { Position } from '@/types/position';

// Store the value of pi.
const pi = Math.PI;

function degreesToRadians(degrees) {
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi / 180);
}


const getDistance = (cesiumViewer: Viewer, CesiumJs: CesiumType) => {
  const width = cesiumViewer.container.clientWidth;
  const height = cesiumViewer.container.clientHeight;

  // new test
  const ray = cesiumViewer.camera.getPickRay(new CesiumJs.Cartesian2(width / 2, height / 2));

  if (ray) {
    const position = cesiumViewer.scene.globe.pick(ray, cesiumViewer.scene);
    console.log('pos', position);
    if (position !== undefined) {
      return CesiumJs.Cartesian3.distance(cesiumViewer.camera.positionWC, position);
    }
  }

  return 1000.0;
};

//NOTE: It is important to assign types using "import type", not "import"
export const CesiumComponent: React.FunctionComponent<{
  CesiumJs: CesiumType,
  positions: Position[]
}> = ({
  CesiumJs,
  positions,
}) => {
    const cesiumViewer = React.useRef<Viewer | null>(null);
    const cesiumContainerRef = React.useRef<HTMLDivElement>(null);
    const addedScenePrimitives = React.useRef<Cesium3DTileset[]>([]);
    const bounding = React.useRef<BoundingSphere | null>(null);
    const circle = React.useRef<Primitive | null>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isTilesetLoaded, setIsTilesetLoaded] = React.useState(false);
    const [isRotating, setIsRotating] = React.useState(false);
    const [targetElevation, setTargetElevation] = React.useState(0);
    // let modelMatrix;

    const resetCamera = React.useCallback(async () => {
      if (cesiumViewer.current !== null) {
        let heading = -CesiumJs.Math.PI_OVER_TWO;
        const rotation = -1; //counter-clockwise; +1 would be clockwise
        const center = CesiumJs.Cartesian3.fromDegrees(positions[0].lng, positions[0].lat, targetElevation);
        const elevation = 1000; // 100 meters
        const pitch = -CesiumJs.Math.PI_OVER_SIX;

        if (isRotating) {
          const SMOOTHNESS = 2400;

          cesiumViewer.current.clock.onTick.addEventListener(() => {
            if (cesiumViewer.current) {
              console.log(cesiumViewer.current.camera.up.z);
              heading += rotation * Math.PI / SMOOTHNESS;
              cesiumViewer.current.camera.lookAt(center, new CesiumJs.HeadingPitchRange(heading, pitch, elevation));
            }
          });
        } else {
          cesiumViewer.current.camera.lookAt(center, new CesiumJs.HeadingPitchRange(
            -CesiumJs.Math.PI_OVER_TWO,
            -CesiumJs.Math.PI_OVER_SIX,
            1000.0
          ));

          // reset camera lookat focus
          // cesiumViewer.current.camera.lookAtTransform(CesiumJs.Matrix4.IDENTITY);
        }
        const handler = new CesiumJs.ScreenSpaceEventHandler(cesiumViewer.current.canvas);

        // handler.setInputAction(function () {
        // }, CesiumJs.ScreenSpaceEventType.WHEEL);

        // point to new center
        /*
          handler.setInputAction(function (movement) {
            if (cesiumViewer.current) {
              setIsRotating(false);
              // viewer.zoomTo instead?
              const newCenter = cesiumViewer.current.scene.pickPosition(movement.position);
              const xy = CesiumJs.Cartographic.fromCartesian(newCenter);
              const cameraHeight = cesiumViewer.current.camera.positionCartographic.height;
              const cartographicDesination = CesiumJs.Cartographic.fromCartesian(newCenter);
              cartographicDesination.height = cameraHeight;
              const newCenter2 = CesiumJs.Cartographic.toCartesian(cartographicDesination);
  
              const distance = getDistance(cesiumViewer.current, CesiumJs);
              console.log('distance', distance);
  
              cesiumViewer.current.camera.flyTo({
                destination: newCenter2, maximumHeight: 0, complete: () => {
                  if (cesiumViewer.current?.camera) {
                    // what is wrong with the pos?
                    // cesiumViewer.current.camera.lookAt(newCenter, new CesiumJs.HeadingPitchRange(0, degreesToRadians(-90), cameraHeight));
                  }
                },
                // orientation: {
                //   pitch: CesiumJs.Math.toRadians(-35.0),
                // }
              });
            }
          }, CesiumJs.ScreenSpaceEventType.LEFT_CLICK);
        */

        // red focus sphere
        /*
        handler.setInputAction(function (movement) {
          if (cesiumViewer.current) {
            setIsRotating(false);
            const pos = cesiumViewer.current.scene.pickPosition(movement.endPosition);
            // const sphere = new CesiumJs.SphereGeometry({
            //   radius: 100.0,
            // });
            // const geometry = CesiumJs.SphereGeometry.createGeometry(sphere);

            // if (geometry) {
            //   const g = cesiumViewer.current.scene.primitives.add(geometry);
            //   g.pos
            //   console.log(g);
            // }

            if (pos && circle.current) {
              circle.current.modelMatrix = CesiumJs.Transforms.eastNorthUpToFixedFrame(pos);
              if (cesiumViewer.current && cesiumViewer.current.clock.currentTime && circle.current?.modelMatrix) {
                const normalizedScale = Math.max(Math.min(cesiumViewer.current.camera.position.z, 1000), 10) / 1000;
                if (cesiumViewer.current.scene.mode !== CesiumJs.SceneMode.MORPHING && circle.current && circle.current.modelMatrix) {
                  CesiumJs.Matrix4.multiplyByUniformScale(circle.current.modelMatrix, normalizedScale || 1, circle.current.modelMatrix);
                }
              }
            }
            // const translation = CesiumJs.Matrix4.fromTranslation(
            //   new CesiumJs.Cartesian3(0.0, 0.0, -1.0)
            // );
            // CesiumJs.Matrix4.multiply(modelMatrix, translation, modelMatrix);

          }
        }, CesiumJs.ScreenSpaceEventType.MOUSE_MOVE);
        */
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      if (cesiumViewer.current && isTilesetLoaded) {
        setTimeout(function () {
          const centerx1 = CesiumJs.Cartesian3.fromDegrees(positions[0].lng, positions[0].lat, 0);
          const clampedHeight = cesiumViewer.current?.scene.clampToHeight(centerx1);
          if (clampedHeight && cesiumViewer.current) {
            cesiumViewer.current.camera.lookAt(clampedHeight, {
              heading: -CesiumJs.Math.PI_OVER_TWO,
              pitch: -CesiumJs.Math.PI_OVER_SIX,
              range: 500.0
            });
            // cesiumViewer.current.camera.lookAtTransform(CesiumJs.Matrix4.IDENTITY);
            // console.log(cesiumViewer.current.camera.constrainedAxis);
            if (cesiumViewer.current && cesiumViewer.current.clock.currentTime && circle.current?.modelMatrix) {
              const matrx = circle.current.modelMatrix.clone();
              // cesiumViewer.current.clock.onTick.addEventListener(() => {
              //   if (cesiumViewer.current && cesiumViewer.current.clock.currentTime && circle.current?.modelMatrix) {
              //     const normalizedScale = Math.max(Math.min(cesiumViewer.current.camera.position.z, 1000), 10) / 1000;
              //     if (cesiumViewer.current.scene.mode !== CesiumJs.SceneMode.MORPHING && circle.current && circle.current.modelMatrix) {
              //       CesiumJs.Matrix4.multiplyByUniformScale(circle.current.modelMatrix, normalizedScale || 1, circle.current.modelMatrix);
              //     }
              //   }
              // });
            }
          }
        }, 2000);
      }
    }, [isTilesetLoaded]);

    const cleanUpPrimitives = React.useCallback(async () => {
      //On NextJS 13.4+, React Strict Mode is on by default.
      //The block below will remove all added primitives from the scene.
      addedScenePrimitives.current.forEach(scenePrimitive => {
        if (cesiumViewer.current !== null) {
          cesiumViewer.current.scene.primitives.remove(scenePrimitive);
        }
      });
      addedScenePrimitives.current = [];
    }, []);

    const initializeCesiumJs = React.useCallback(async () => {
      if (cesiumViewer.current !== null) {
        //Clean up potentially already-existing primitives.
        cleanUpPrimitives();
        let tileset;
        try {
          tileset = await CesiumJs.Cesium3DTileset.fromIonAssetId(2275207);
        } catch (error) {
          throw Error('Could not load tileset.');
        }
        console.log(tileset);
        bounding.current = tileset.boundingSphere;
        // setTiles(tileset.boundingSphere);
        const tiles = cesiumViewer.current.scene.primitives.add(tileset);
        addedScenePrimitives.current.push(tiles);

        // red focus sphere
        /*
        const sphere = cesiumViewer.current.scene.primitives.add(
          new CesiumJs.Primitive({
            geometryInstances: new CesiumJs.GeometryInstance({
              geometry: new CesiumJs.SphereGeometry({
                radius: 20.0
              }),
              modelMatrix: modelMatrix,
              attributes: {
                color: CesiumJs.ColorGeometryInstanceAttribute.fromColor(
                  CesiumJs.Color.fromCssColorString('#ff0000').withAlpha(0.5)
                ),
              },
            }),
            appearance: new CesiumJs.PerInstanceColorAppearance(),
          })
        );
        circle.current = sphere;
        */

        setIsTilesetLoaded(true);

        //Position camera per Sandcastle demo
        resetCamera();

        //Set loaded flag
        setIsLoaded(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }
    }, [positions]);

    React.useEffect(() => {
      if (cesiumViewer.current === null && cesiumContainerRef.current) {
        //OPTIONAL: Assign access Token here
        //Guide: https://cesium.com/learn/ion/cesium-ion-access-tokens/
        CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;

        //NOTE: Always utilize CesiumJs; do not import them from "cesium"
        cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
          //Using the Sandcastle example below
          //https://sandcastle.cesium.com/?src=3D%20Tiles%20Feature%20Styling.html
          animation: false,
          baseLayerPicker: false,
          fullscreenElement: cesiumContainerRef.current,
          geocoder: false,
          // globe: false,
          homeButton: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          timeline: false,
        });

        //NOTE: Example of configuring a Cesium viewer
        cesiumViewer.current.clock.clockStep = CesiumJs.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      if (isLoaded) return;
      initializeCesiumJs();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions, isLoaded]);

    return (
      <div
        ref={cesiumContainerRef}
        id='cesium-container'
      />
    );
  };

export default CesiumComponent;