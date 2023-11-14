'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { BufferGeometry, InstancedMesh, MathUtils } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface SceneProps {
  fileUrl: string;
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

  return (
    <mesh ref={meshRef} rotation={[MathUtils.degToRad(-90), 0, rotation]} position={[0, -100, 0]} geometry={geometry}>
      <meshStandardMaterial color="#fff" />
    </mesh>
  );
}

export function Scene({ fileUrl }: SceneProps) {
  const [geometry, setGeometry] = useState<BufferGeometry>();
  const [scrollPosition, setScrollPosition] = useState(window?.scrollY ?? 0);

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
      setGeometry(geo);
    });
  }, []);

  return (
    <Canvas camera={{ position: [0, 20, -200] }} style={{ width: '100%', height: '600px' }}>
      {/* <ambientLight position={[0, 20, -200]} castShadow /> */}
      {/* <pointLight position={[0, 20, -200]} color="#fff" castShadow /> */}
      <directionalLight position={[0, 20, -200]} color="#fff" castShadow intensity={1.5} />
      <Mesh geometry={geometry} scrollPosition={scrollPosition} />
    </Canvas>
  );
}
