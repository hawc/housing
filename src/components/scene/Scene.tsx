'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { BufferGeometry, InstancedMesh, MathUtils } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface SceneProps extends React.HTMLAttributes<HTMLElement> {
  fileUrl: string;
  height?: string;
  width?: string;
}

function Mesh({ geometry, scrollPosition }) {
  const meshRef = useRef<InstancedMesh>(null);
  const [rotation, setRotation] = useState(0);
  const [frame, setFrame] = useState(0);

  useFrame(() => {
    if (meshRef.current) {
      setFrame(frame + 0.001);
      setRotation((scrollPosition / 500) + frame);
    }
  });

  const colorMap = useLoader(EXRLoader, '/images/040full.exr');


  return (
    <mesh
      receiveShadow
      castShadow ref={meshRef} rotation={[MathUtils.degToRad(-90), 0, rotation]} position={[0, -100, 0]} geometry={geometry}>
      <meshMatcapMaterial color="#ff4d00" matcap={colorMap} />
    </mesh>
  );
}

export function Scene({ fileUrl, height, width, ...rest }: SceneProps) {
  const [geometry, setGeometry] = useState<BufferGeometry>();
  const [scrollPosition, setScrollPosition] = useState(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    if (typeof window !== 'undefined') {

      const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const stlLoader = new STLLoader();
    stlLoader.load(fileUrl, geo => {
      geo.computeVertexNormals();
      setGeometry(geo);
    });
  }, []);

  return (
    <div {...rest}>
      <Canvas orthographic camera={{ position: [0, 20, -200], zoom: 3 }} style={{ width: width ?? '100%', height: height ?? '600px' }}>
        <Mesh geometry={geometry} scrollPosition={scrollPosition} />
      </Canvas>
    </div>
  );
}
