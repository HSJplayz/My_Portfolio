"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

let targetX = 0;
let targetY = 0;

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

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetX * 0.5, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetY * 0.3, 0.05);
  });

  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#ffd9a0" />
      <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#d97951" />

      <Rig>
        <Float speed={reduced ? 0 : 1.6} rotationIntensity={0.5} floatIntensity={1.4}>
          <mesh>
            <sphereGeometry args={[1.35, 64, 64]} />
            <MeshDistortMaterial
              color="#a94a2c"
              roughness={0.18}
              metalness={0.05}
              distort={0.35}
              speed={reduced ? 0 : 1.5}
            />
          </mesh>
        </Float>

        <Float speed={reduced ? 0 : 2} rotationIntensity={1} floatIntensity={0.9}>
          <mesh position={[2.15, -1.1, -1]}>
            <torusGeometry args={[0.55, 0.18, 24, 64]} />
            <meshStandardMaterial color="#d97951" roughness={0.3} metalness={0.25} />
          </mesh>
        </Float>

        <Float speed={reduced ? 0 : 1.9} rotationIntensity={0.8} floatIntensity={1.1}>
          <mesh position={[-2.25, 1.15, -1.4]}>
            <icosahedronGeometry args={[0.48, 0]} />
            <meshStandardMaterial color="#1b1713" roughness={0.35} metalness={0.4} flatShading />
          </mesh>
        </Float>

        <Float speed={reduced ? 0 : 2.3} rotationIntensity={0.6} floatIntensity={1}>
          <mesh position={[-1.7, -1.45, -2]}>
            <torusKnotGeometry args={[0.3, 0.1, 120, 18]} />
            <meshStandardMaterial color="#7b4b94" roughness={0.35} metalness={0.2} />
          </mesh>
        </Float>
      </Rig>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={10} blur={2.6} far={4.5} />
      <Sparkles count={80} scale={9} size={2.2} speed={reduced ? 0 : 0.4} opacity={0.45} color="#d97951" />
    </Canvas>
  );
}
