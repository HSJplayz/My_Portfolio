"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const damp = (a: number, b: number, k: number, dt: number) =>
  THREE.MathUtils.lerp(a, b, 1 - Math.pow(1 - k, dt * 60));

export type BotMode = "idle" | "typing" | "thinking" | "speaking";

let pointerX = 0;
let pointerY = 0;

function PointerTracker() {
  const { size } = useThree();
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / size.width - 0.5) * 2;
      pointerY = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size]);
  return null;
}

function Robot({ mode }: { mode: BotMode }) {
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
  const dots = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const lastT = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(Math.max(t - lastT.current, 0.016), 0.1);
    lastT.current = t;

    const thinking = mode === "thinking";
    const speaking = mode === "speaking";
    const typing = mode === "typing";

    const lookX = pointerX * 0.12;
    const lookY = -pointerY * 0.08;

    const headYTarget = (typing ? -0.4 : thinking ? 0.42 : speaking ? Math.sin(t * 1.1) * 0.18 : Math.sin(t * 0.7) * 0.25) + lookX;
    const headXTarget = (typing ? -0.24 : thinking ? 0.32 : speaking ? 0.05 + Math.sin(t * 2.1) * 0.04 : 0.03 + Math.sin(t * 0.5) * 0.02) + lookY;
    const headZTarget = typing ? 0.08 : thinking ? 0.1 : speaking ? Math.sin(t * 1.6) * 0.04 : Math.sin(t * 0.6) * 0.05;

    const pupilXTarget = (typing ? -0.022 : thinking ? 0.02 : speaking ? Math.sin(t * 2.6) * 0.014 : Math.sin(t * 0.45) * 0.016) + lookX * 0.15;
    const pupilYTarget = (typing ? -0.016 : thinking ? 0.015 : 0) + lookY * 0.1;

    const browLTarget = typing ? 0.16 : thinking ? -0.3 : 0;
    const browRTarget = typing ? 0.16 : thinking ? 0.3 : 0;

    const mouthScale = speaking
      ? 0.55 + 0.5 * Math.abs(Math.sin(t * 7))
      : thinking
        ? 0.38
        : typing
          ? 0.52
          : 0.6 + 0.04 * Math.sin(t * 1.2);

    const armLTarget = thinking
      ? -1.35 + Math.sin(t * 0.9) * 0.04
      : speaking
        ? -0.55 + Math.sin(t * 3) * 0.35
        : typing
          ? -0.5 + Math.sin(t * 7) * 0.32
          : -0.05 + Math.sin(t * 1.1) * 0.09;
    const armRTarget = thinking
      ? 0.1 + Math.sin(t * 0.7) * 0.06
      : speaking
        ? -0.55 + Math.sin(t * 3 + 1.2) * 0.35
        : typing
          ? -0.5 + Math.sin(t * 7 + 1.3) * 0.32
          : -0.05 + Math.sin(t * 1.1 + 1.4) * 0.09;

    const swayTarget = thinking
      ? Math.sin(t * 0.7) * 0.05
      : speaking
        ? Math.sin(t * 2.4) * 0.04
        : Math.sin(t * (typing ? 1.4 : 0.9)) * 0.03;

    const blinkPeriod = speaking ? 1.8 : typing ? 2.6 : thinking ? 4.5 : 3.1;
    const blink = t % blinkPeriod < 0.16 ? 0.08 : 1;

    const chest = speaking
      ? 1.7 + 0.7 * Math.sin(t * 8)
      : thinking
        ? 1.0 + 0.2 * Math.sin(t * 1.2)
        : typing
          ? 1.1 + 0.3 * Math.sin(t * 2.6)
          : 0.9 + 0.25 * Math.sin(t * 2);
    const antenna = speaking
      ? 2.8 + 0.9 * Math.sin(t * 9)
      : thinking
        ? 2.2 + 0.4 * Math.sin(t * 1.4)
        : typing
          ? 1.8 + 0.5 * Math.sin(t * 2.6)
          : 1.6 + 0.4 * Math.sin(t * 2.2);

    if (head.current) {
      head.current.rotation.x = damp(head.current.rotation.x, headXTarget, 0.08, dt);
      head.current.rotation.y = damp(head.current.rotation.y, headYTarget, 0.08, dt);
      head.current.rotation.z = damp(head.current.rotation.z, headZTarget, 0.08, dt);
    }
    if (bodySway.current) bodySway.current.rotation.z = damp(bodySway.current.rotation.z, swayTarget, 0.06, dt);
    if (leftArm.current) leftArm.current.rotation.x = damp(leftArm.current.rotation.x, armLTarget, 0.1, dt);
    if (rightArm.current) rightArm.current.rotation.x = damp(rightArm.current.rotation.x, armRTarget, 0.1, dt);
    if (leftPupil.current) {
      leftPupil.current.position.x = pupilXTarget;
      leftPupil.current.position.y = pupilYTarget;
    }
    if (rightPupil.current) {
      rightPupil.current.position.x = pupilXTarget;
      rightPupil.current.position.y = pupilYTarget;
    }
    if (eyes.current) eyes.current.scale.y = damp(eyes.current.scale.y, blink, 0.5, dt);
    if (leftBrow.current) leftBrow.current.rotation.z = damp(leftBrow.current.rotation.z, browLTarget, 0.12, dt);
    if (rightBrow.current) rightBrow.current.rotation.z = damp(rightBrow.current.rotation.z, browRTarget, 0.12, dt);
    if (mouth.current) mouth.current.scale.x = damp(mouth.current.scale.x, mouthScale, 0.15, dt);
    if (chestMat.current) chestMat.current.emissiveIntensity = chest;
    if (antennaMat.current) antennaMat.current.emissiveIntensity = antenna;

    dots.forEach((d, i) => {
      if (!d.current) return;
      const s = thinking ? 0.55 + 0.45 * Math.sin(t * 5 - i * 0.9) : 0;
      d.current.scale.setScalar(damp(d.current.scale.x, s, 0.3, dt));
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={bodySway} scale={1.45}>
        {/* antenna */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#3a322a" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial ref={antennaMat} color="#ff9a5c" emissive="#ff9a5c" emissiveIntensity={1.6} />
        </mesh>

        {/* thinking dots */}
        <group position={[0, 0.82, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} ref={dots[i]} position={[(i - 1) * 0.095, 0, 0]}>
              <sphereGeometry args={[0.042, 10, 10]} />
              <meshBasicMaterial color="#d97951" />
            </mesh>
          ))}
        </group>

        {/* head — everything face-related is a child so it rotates together */}
        <group ref={head} position={[0, 0.18, 0]}>
          <RoundedBox args={[0.42, 0.32, 0.38]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color="#26201b" metalness={0.5} roughness={0.35} />
          </RoundedBox>
          {/* face panel */}
          <mesh position={[0, 0.02, 0.195]}>
            <planeGeometry args={[0.34, 0.26]} />
            <meshStandardMaterial color="#12100e" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* eyes group (blink scales this) */}
          <group ref={eyes} position={[0, 0, 0]}>
            {/* eye sockets */}
            {[-0.1, 0.1].map((x) => (
              <mesh key={x} position={[x, 0.06, 0.205]}>
                <sphereGeometry args={[0.036, 16, 16]} />
                <meshStandardMaterial color="#f2f0ea" roughness={0.25} />
              </mesh>
            ))}
            {/* pupils */}
            {[-0.1, 0.1].map((x, i) => (
              <mesh key={"p" + x} ref={i === 0 ? leftPupil : rightPupil} position={[x, 0.06, 0.212]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#1b1713" roughness={0.3} />
              </mesh>
            ))}
          </group>
          {/* eyebrows */}
          <mesh ref={leftBrow} position={[-0.1, 0.13, 0.205]}>
            <boxGeometry args={[0.07, 0.016, 0.016]} />
            <meshStandardMaterial color="#4a4036" roughness={0.4} />
          </mesh>
          <mesh ref={rightBrow} position={[0.1, 0.13, 0.205]}>
            <boxGeometry args={[0.07, 0.016, 0.016]} />
            <meshStandardMaterial color="#4a4036" roughness={0.4} />
          </mesh>
          {/* mouth */}
          <mesh ref={mouth} position={[0, -0.04, 0.195]}>
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

export function ChatBot({ mode }: { mode: BotMode }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.45], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "auto" }}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 3]} intensity={1.6} color="#ffe8d0" />
      <directionalLight position={[-2, -1, 2]} intensity={0.5} color="#d97951" />
      <PointerTracker />
      <Suspense fallback={null}>
        <Robot mode={mode} />
      </Suspense>
    </Canvas>
  );
}
