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

const damp = (a: number, b: number, k: number, dt: number) =>
  THREE.MathUtils.lerp(a, b, 1 - Math.pow(1 - k, dt * 60));

function Robot({
  busy,
  hasInput,
  reduced,
}: {
  busy: boolean;
  hasInput: boolean;
  reduced: boolean;
}) {
  const head = useRef<THREE.Group>(null);
  const bodySway = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftPupil = useRef<THREE.Mesh>(null);
  const rightPupil = useRef<THREE.Mesh>(null);
  const leftBrow = useRef<THREE.Mesh>(null);
  const rightBrow = useRef<THREE.Mesh>(null);
  const eyes = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const chestMat = useRef<THREE.MeshStandardMaterial>(null);
  const antennaMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (reduced) return;

    // targets per state
    const mode = busy ? "busy" : hasInput ? "typing" : "idle";
    const headX = mode === "typing" ? 0.22 : mode === "busy" ? -0.1 : 0;
    const headZ = Math.sin(t * 0.6) * 0.05;
    const pupilY = mode === "typing" ? -0.012 : mode === "busy" ? 0.006 : 0;
    const pupilX = busy ? Math.sin(t * 2.2) * 0.012 : Math.sin(t * 0.45) * 0.015;
    const armBusy = mode === "busy" ? 1 : 0;
    const browFurrow = mode === "busy" ? 1 : 0;

    if (head.current) {
      head.current.rotation.x = damp(head.current.rotation.x, headX, 0.08, delta) + (mode === "busy" ? Math.sin(t * 5) * 0.03 : 0);
      head.current.rotation.z = damp(head.current.rotation.z, headZ, 0.08, delta);
    }
    if (bodySway.current) {
      bodySway.current.rotation.z = damp(bodySway.current.rotation.z, busy ? Math.sin(t * 4) * 0.04 : Math.sin(t * 0.8) * 0.02, 0.06, delta);
    }
    if (leftArm.current)
      leftArm.current.rotation.x = damp(leftArm.current.rotation.x, -0.05 - armBusy * 1.15, 0.08, delta) + (busy ? Math.sin(t * 6) * 0.12 : 0);
    if (rightArm.current)
      rightArm.current.rotation.x = damp(rightArm.current.rotation.x, -0.05 + armBusy * 0.35, 0.08, delta) + (busy ? Math.sin(t * 6 + 1.2) * 0.1 : 0);
    if (leftPupil.current) {
      leftPupil.current.position.x = pupilX;
      leftPupil.current.position.y = pupilY;
    }
    if (rightPupil.current) {
      rightPupil.current.position.x = pupilX;
      rightPupil.current.position.y = pupilY;
    }
    if (eyes.current) {
      const blink = busy ? Math.max(0.05, Math.abs(Math.sin(t * 5))) : 0.82 + 0.18 * Math.sin(t * 1.4);
      eyes.current.scale.y = damp(eyes.current.scale.y, blink, 0.4, delta);
    }
    if (leftBrow.current) leftBrow.current.rotation.z = damp(leftBrow.current.rotation.z, 0.22 * browFurrow, 0.1, delta);
    if (rightBrow.current) rightBrow.current.rotation.z = damp(rightBrow.current.rotation.z, -0.22 * browFurrow, 0.1, delta);
    if (mouth.current) mouth.current.scale.x = damp(mouth.current.scale.x, busy ? 0.6 + 0.4 * Math.abs(Math.sin(t * 7)) : 0.6, 0.12, delta);
    if (chestMat.current)
      chestMat.current.emissiveIntensity = busy ? 1.7 + 0.7 * Math.sin(t * 8) : 0.9 + 0.15 * Math.sin(t * 1.2);
    if (antennaMat.current)
      antennaMat.current.emissiveIntensity = busy ? 3 + Math.sin(t * 10) : 1.6 + 0.3 * Math.sin(t * 1.6);
  });

  return (
    <Float speed={reduced ? 0 : 2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={bodySway}>
        {/* antenna */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#3a322a" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial ref={antennaMat} color="#ff9a5c" emissive="#ff9a5c" emissiveIntensity={1.6} />
        </mesh>

        {/* head */}
        <group ref={head}>
          <RoundedBox args={[0.42, 0.32, 0.38]} radius={0.06} smoothness={4} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#26201b" metalness={0.5} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0.3, 0.195]}>
            <planeGeometry args={[0.34, 0.26]} />
            <meshStandardMaterial color="#12100e" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* eyes + sockets */}
          {[-0.1, 0.1].map((x) => (
            <mesh key={x} position={[x, 0.33, 0.2]}>
              <sphereGeometry args={[0.062, 16, 16]} />
              <meshStandardMaterial color="#3a332b" roughness={0.4} />
            </mesh>
          ))}
          <group ref={eyes}>
            {[-0.1, 0.1].map((x) => (
              <mesh key={x} position={[x, 0.33, 0.205]}>
                <sphereGeometry args={[0.036, 16, 16]} />
                <meshStandardMaterial color="#f2f0ea" roughness={0.25} />
              </mesh>
            ))}
          </group>
          {[-0.1, 0.1].map((x, i) => (
            <mesh key={"p" + x} ref={i === 0 ? leftPupil : rightPupil} position={[x, 0.33, 0.212]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial color="#1b1713" roughness={0.3} />
            </mesh>
          ))}
          {/* eyebrows */}
          <mesh ref={leftBrow} position={[-0.1, 0.4, 0.205]}>
            <boxGeometry args={[0.07, 0.016, 0.016]} />
            <meshStandardMaterial color="#4a4036" roughness={0.4} />
          </mesh>
          <mesh ref={rightBrow} position={[0.1, 0.4, 0.205]}>
            <boxGeometry args={[0.07, 0.016, 0.016]} />
            <meshStandardMaterial color="#4a4036" roughness={0.4} />
          </mesh>
          {/* mouth */}
          <mesh ref={mouth} position={[0, 0.235, 0.195]}>
            <planeGeometry args={[0.1, 0.014]} />
            <meshStandardMaterial color="#5a4a3c" roughness={0.4} />
          </mesh>
        </group>

        {/* arms */}
        <group ref={leftArm} position={[-0.25, -0.06, 0]}>
          <mesh position={[0, -0.13, 0]}>
            <boxGeometry args={[0.055, 0.24, 0.055]} />
            <meshStandardMaterial color="#322a23" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#e08a3c" emissive="#e08a3c" emissiveIntensity={1.2} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.25, -0.06, 0]}>
          <mesh position={[0, -0.13, 0]}>
            <boxGeometry args={[0.055, 0.24, 0.055]} />
            <meshStandardMaterial color="#322a23" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#e08a3c" emissive="#e08a3c" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* body */}
        <RoundedBox args={[0.44, 0.34, 0.3]} radius={0.07} smoothness={4} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#322a23" metalness={0.5} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, -0.16, 0.155]}>
          <planeGeometry args={[0.18, 0.1]} />
          <meshStandardMaterial ref={chestMat} color="#e08a3c" emissive="#e08a3c" emissiveIntensity={0.9} />
        </mesh>
        {/* feet */}
        <mesh position={[-0.11, -0.42, 0]}>
          <boxGeometry args={[0.14, 0.06, 0.2]} />
          <meshStandardMaterial color="#26201b" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.11, -0.42, 0]}>
          <boxGeometry args={[0.14, 0.06, 0.2]} />
          <meshStandardMaterial color="#26201b" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

export function ChatBot({ busy, hasInput }: { busy: boolean; hasInput: boolean }) {
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
        <Robot busy={busy} hasInput={hasInput} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
