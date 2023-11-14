import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { BufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface SceneProps {
  fileUrl: string;
}

export function Scene({ fileUrl }: SceneProps) {
  const [geometry, setGeometry] = useState<BufferGeometry>();

  useEffect(() => {
    const stlLoader = new STLLoader();
    stlLoader.load(fileUrl, geo => {
      setGeometry(geo);
    });
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </Canvas>
  );
}
