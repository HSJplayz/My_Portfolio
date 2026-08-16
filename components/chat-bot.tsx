"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Eyes({ busy, reduced }: { busy: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const open = reduced ? 1 : busy ? Math.abs(Math.sin(t * 5)) : 0.85 + 0.15 * Math.sin(t * 1.4);
    group.current.scale.y = open;
  });
  return (
    <group ref={group} position={[0, 0.2, 0.215]}>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial
            color="#ff8c42"
            emissive="#ff8c42"
            emissiveIntensity={2.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function Robot({ busy, reduced }: { busy: boolean; reduced: boolean }) {
  return (
    <Float speed={reduced ? 0 : 2} rotationIntensity={0.4} floatIntensity={0.5}>
      <group>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#3a322a" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ff9a5c" emissive="#ff9a5c" emissiveIntensity={2.5} />
        </mesh>
        <RoundedBox args={[0.42, 0.34, 0.4]} radius={0.06} smoothness={4} position={[0, 0.18, 0]}>
          <meshStandardMaterial color="#26201b" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.18, 0.205]}>
          <planeGeometry args={[0.34, 0.26]} />
          <meshStandardMaterial color="#12100e" roughness={0.3} metalness={0.2} />
        </mesh>
        <Eyes busy={busy} reduced={reduced} />
        <RoundedBox args={[0.44, 0.36, 0.34]} radius={0.07} smoothness={4} position={[0, -0.26, 0]}>
          <meshStandardMaterial color="#322a23" metalness={0.5} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, -0.2, 0.18]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#e08a3c" emissive="#e08a3c" emissiveIntensity={1.6} />
        </mesh>
      </group>
    </Float>
  );
}

export function ChatBot({ busy }: { busy: boolean }) {
  const reduced = useReducedMotion();
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 3]} intensity={1.6} color="#ffe8d0" />
      <directionalLight position={[-2, -1, 2]} intensity={0.5} color="#d97951" />
      <Suspense fallback={null}>
        <Robot busy={busy} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
