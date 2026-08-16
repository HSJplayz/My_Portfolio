"use client";

// Laptop model: "Laptop" by Poly by Google — poly.pizza/m/6eBS-C3E33W — CC-BY 3.0.
// https://creativecommons.org/licenses/by/3.0/

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { asset } from "@/lib/asset";

// Screen panel measured from the model (centered + scaled to 3.2 wide).
const MODEL_WIDTH = 3.2;
const SCREEN_CENTER: [number, number, number] = [-0.0006, 0.029, -1.0514];
const SCREEN_NORMAL: [number, number, number] = [0, 0.2584, 0.966];
const CODE_W = 2.86;
const CODE_H = CODE_W * (640 / 1024);

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
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetX * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetY * 0.2, 0.05);
  });

  return <group ref={ref}>{children}</group>;
}

function buildCodeTexture() {
  const w = 1024;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const font = "20px Consolas, Menlo, monospace";

  ctx.fillStyle = "#161310";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#a94a2c";
  ctx.beginPath();
  ctx.arc(42, 42, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d97951";
  ctx.beginPath();
  ctx.arc(76, 42, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#72695c";
  ctx.beginPath();
  ctx.arc(110, 42, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#57504a";
  ctx.font = font;
  ctx.fillText("vision-bot.ts", 140, 51);

  const lines: { num: number; indent: number; color: string; text: string }[] = [
    { num: 1, indent: 0, color: "#8b9bb4", text: 'import { VisionBot } from "./bot";' },
    { num: 2, indent: 0, color: "#161310", text: "" },
    { num: 3, indent: 0, color: "#d8cfc0", text: "const bot = new VisionBot({" },
    { num: 4, indent: 1, color: "#e2a76f", text: 'model: "yolov8",' },
    { num: 5, indent: 1, color: "#d8cfc0", text: "fps: 30," },
    { num: 6, indent: 0, color: "#d8cfc0", text: "});" },
    { num: 7, indent: 0, color: "#161310", text: "" },
    { num: 8, indent: 0, color: "#d8cfc0", text: 'bot.on("detect", async (frame) => {' },
    { num: 9, indent: 1, color: "#a1d0a1", text: "const target = await bot.locate(frame);" },
    { num: 10, indent: 1, color: "#d8cfc0", text: "await arm.moveTo(target);" },
    { num: 11, indent: 0, color: "#d8cfc0", text: "});" },
    { num: 12, indent: 0, color: "#161310", text: "" },
    { num: 13, indent: 0, color: "#6d6459", text: "// deploying to the edge…" },
    { num: 14, indent: 0, color: "#d97951", text: "bot.deploy();" },
  ];

  const startY = 128;
  const lineH = 44;
  lines.forEach((line, i) => {
    ctx.fillStyle = "#4c463f";
    ctx.font = font;
    ctx.fillText(String(line.num), 22, startY + i * lineH);
    if (line.text) {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 62 + line.indent * 32, startY + i * lineH);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Laptop() {
  const codeTexture = useMemo(() => buildCodeTexture(), []);
  const { scene } = useGLTF(asset("/models/laptop.glb"));

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = MODEL_WIDTH / size.x;
    clone.scale.setScalar(scale);
    clone.position.sub(center.multiplyScalar(scale));
    return clone;
  }, [scene]);

  const screenQuat = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(...SCREEN_NORMAL)
      ),
    []
  );

  useEffect(() => () => codeTexture.dispose(), [codeTexture]);

  return (
    <group rotation={[0.06, -0.55, 0]} position={[0, 0.1, 0]}>
      <primitive object={model} />
      <mesh
        position={[
          SCREEN_CENTER[0],
          SCREEN_CENTER[1] - 0.05,
          SCREEN_CENTER[2] + 0.012,
        ]}
        quaternion={screenQuat}
      >
        <planeGeometry args={[CODE_W, CODE_H]} />
        <meshBasicMaterial map={codeTexture} toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, 0, SCREEN_CENTER[2] + 0.7]}
        intensity={0.55}
        distance={3.5}
        color="#d97951"
      />
    </group>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#ffe2c0" />
      <directionalLight position={[-3, 2, -3]} intensity={0.7} color="#d97951" />
      <directionalLight position={[0, 3, 6]} intensity={1.1} color="#fff0e0" />
      <pointLight position={[-2, 1.5, 3.5]} intensity={0.5} color="#d97951" />

      <Rig>
        <Float speed={reduced ? 0 : 1.4} rotationIntensity={0.35} floatIntensity={0.9}>
          <Suspense fallback={null}>
            <Laptop />
          </Suspense>
        </Float>
      </Rig>

      <ContactShadows position={[0, -1.3, 0]} opacity={0.32} scale={11} blur={2.8} far={5} />
      <Sparkles count={70} scale={9} size={2} speed={reduced ? 0 : 0.35} opacity={0.4} color="#d97951" />
    </Canvas>
  );
}
