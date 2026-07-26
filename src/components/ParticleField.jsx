/* eslint-disable react/no-unknown-property */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ParticleLayer = ({ count, size, opacity, radius, speed, reduced }) => {
  const ref = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * radius * 2.4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * radius * 1.6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * radius;
    }
    return arr;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * speed;
    const { x, y } = state.pointer;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.5, 0.02);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.3, 0.02);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#E4E4E7"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ParticleField = ({ paused = false }) => {
  const reduced = useMemo(prefersReducedMotion, []);
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );
  const density = isMobile ? 0.4 : 1;

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? 'demand' : paused ? 'never' : 'always'}
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      eventSource={document.documentElement}
      eventPrefix="client"
    >
      <ParticleLayer
        count={Math.round(500 * density)}
        size={0.045}
        opacity={0.55}
        radius={9}
        speed={0.02}
        reduced={reduced}
      />
      <ParticleLayer
        count={Math.round(300 * density)}
        size={0.09}
        opacity={0.25}
        radius={12}
        speed={-0.012}
        reduced={reduced}
      />
    </Canvas>
  );
};

export default ParticleField;
