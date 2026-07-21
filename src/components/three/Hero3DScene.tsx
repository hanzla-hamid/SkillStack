'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({
  position,
  geometry,
  scale = 1,
  speed = 1,
  distort = 0.3,
  color = '#EAB308',
}: {
  position: [number, number, number];
  geometry: 'icosahedron' | 'torus' | 'octahedron' | 'dodecahedron';
  scale?: number;
  speed?: number;
  distort?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 * speed;
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(1, 0);
      case 'torus':
        return new THREE.TorusGeometry(0.8, 0.25, 16, 32);
      case 'octahedron':
        return new THREE.OctahedronGeometry(1, 0);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(1, 0);
    }
  }, [geometry]);

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale} geometry={geo}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function GlassCube({
  position,
  scale = 1,
  speed = 1,
  cheap = false,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  /** Skip the per-frame offscreen render pass MeshTransmissionMaterial needs — big cost on low-power devices. */
  cheap?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        {cheap ? (
          <meshStandardMaterial color="#EAB308" roughness={0.15} metalness={0.9} transparent opacity={0.35} />
        ) : (
          <MeshTransmissionMaterial
            thickness={0.5}
            roughness={0.1}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.05}
            backside
            color="#EAB308"
            attenuationColor="#FACC15"
            attenuationDistance={0.5}
          />
        )}
      </mesh>
    </Float>
  );
}

function FloatingCard({
  position,
  color = '#EAB308',
  delay = 0,
}: {
  position: [number, number, number];
  color?: string;
  delay?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={ref} position={position}>
        <RoundedBox args={[1.4, 0.7, 0.06]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#1A1A1A"
            roughness={0.3}
            metalness={0.6}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.position.x = pointer.x * 6;
    lightRef.current.position.y = pointer.y * 4;
  });

  return <pointLight ref={lightRef} intensity={2} distance={12} color="#FACC15" />;
}

function MouseTracker() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x += (pointer.x * 3 - camera.position.x) * 0.02;
    camera.position.y += (pointer.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function GoldRing({ radius = 3, tube = 0.04, speed = 0.2 }: { radius?: number; tube?: number; speed?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshStandardMaterial color="#EAB308" metalness={0.9} roughness={0.15} emissive="#EAB308" emissiveIntensity={0.2} />
    </mesh>
  );
}

function NetworkLines() {
  const groupRef = useRef<THREE.Group>(null);
  const lineCount = 8;

  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 4;
      return {
        start: [Math.cos(angle) * radius, Math.sin(angle) * radius, -2] as [number, number, number],
        end: [0, 0, 0] as [number, number, number],
      };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => {
        const points = [new THREE.Vector3(...line.start), new THREE.Vector3(...line.end)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i}>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial color="#EAB308" transparent opacity={0.15} />
          </line>
        );
      })}
    </group>
  );
}

function GradientOrb({
  position,
  color = '#EAB308',
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.scale.setScalar(scale * (1 + Math.sin(t * 0.5) * 0.1));
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.06} />
    </mesh>
  );
}

function Scene({ tier }: { tier: 'high' | 'low' }) {
  const low = tier === 'low';

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FACC15" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#EAB308" />
      {!low && <pointLight position={[0, 3, -5]} intensity={0.3} color="#FDE047" />}
      <MouseLight />
      <MouseTracker />

      <FloatingShape position={[0, 0.5, 0]} geometry="icosahedron" scale={1.3} speed={0.8} distort={0.4} />
      <FloatingShape position={[-3.5, 1.2, -1]} geometry="octahedron" scale={0.6} speed={1.2} distort={0.2} color="#FACC15" />
      <FloatingShape position={[3.5, -0.8, -0.5]} geometry="dodecahedron" scale={0.7} speed={0.9} distort={0.3} color="#FDE047" />
      {!low && <FloatingShape position={[2.8, 1.8, -1.5]} geometry="torus" scale={0.5} speed={1.1} distort={0.1} color="#CA8A04" />}
      {!low && <FloatingShape position={[-3, -1.5, -1]} geometry="icosahedron" scale={0.45} speed={1.3} distort={0.35} color="#FACC15" />}
      {!low && <FloatingShape position={[-1.5, 2.5, -2]} geometry="octahedron" scale={0.4} speed={1.5} distort={0.25} color="#FDE047" />}
      {!low && <FloatingShape position={[2, -2.5, -1.5]} geometry="dodecahedron" scale={0.35} speed={1.4} distort={0.3} color="#EAB308" />}

      <GlassCube position={[-2.5, -0.5, 0]} scale={0.6} speed={0.7} cheap={low} />
      {!low && <GlassCube position={[2.8, 0.8, -1]} scale={0.4} speed={1.1} />}

      <GoldRing radius={3.5} speed={0.15} />
      {!low && <GoldRing radius={2.8} tube={0.03} speed={0.25} />}
      {!low && <GoldRing radius={4.2} tube={0.02} speed={0.1} />}

      {!low && <NetworkLines />}

      <GradientOrb position={[-4, 2, -3]} color="#EAB308" scale={1.5} />
      <GradientOrb position={[4, -2, -3]} color="#FACC15" scale={1.2} />
      {!low && <GradientOrb position={[0, -3, -4]} color="#FDE047" scale={2} />}

      <FloatingCard position={[-3.2, 1.8, 0.5]} delay={0} />
      <FloatingCard position={[3.3, -1.5, 0.8]} delay={1.5} color="#FDE047" />
      {!low && <FloatingCard position={[2, 2.5, -0.5]} delay={3} color="#FACC15" />}
      {!low && <FloatingCard position={[-2.5, -2, 0.3]} delay={4.5} color="#EAB308" />}

      <Sparkles count={low ? 40 : 120} scale={12} size={2} speed={0.3} opacity={0.5} color="#EAB308" />
      {!low && <Sparkles count={60} scale={8} size={1.5} speed={0.5} opacity={0.3} color="#FDE047" />}
      {!low && <Environment preset="night" />}
    </>
  );
}

export function Hero3DScene({
  tier = 'high',
  paused = false,
}: {
  tier?: 'high' | 'low';
  paused?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={tier === 'low' ? 1 : [1, 1.5]}
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      frameloop={paused ? 'never' : 'always'}
    >
      <Suspense fallback={null}>
        <Scene tier={tier} />
      </Suspense>
    </Canvas>
  );
}