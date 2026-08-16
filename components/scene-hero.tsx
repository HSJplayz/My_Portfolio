"use client";

// Laptop model: "Laptop" by Poly by Google — poly.pizza/m/6eBS-C3E33W — CC-BY 3.0.
// https://creativecommons.org/licenses/by/3.0/

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { asset } from "@/lib/asset";

const MODEL_WIDTH = 3.3;
const SCREEN_CENTER: [number, number, number] = [-0.0006, 0.029, -1.0514];
const SCREEN_NORMAL: [number, number, number] = [0, 0.2584, 0.966];
const PANEL_W = 2.95;
const PANEL_H = 1.85;
const CODE_W = 2.75;
const CODE_H = CODE_W * (640 / 1024);

const TABS = [
  {
    name: "vision-bot.ts",
    lines: [
      ["import { VisionBot } from \"./bot\";", "#8b9bb4"],
      ["", null],
      ["const bot = new VisionBot({", "#d8cfc0"],
      ['  model: "yolov8",', "#e2a76f"],
      ["  fps: 30,", "#d8cfc0"],
      ["});", "#d8cfc0"],
      ["", null],
      ['bot.on("detect", async (frame) => {', "#d8cfc0"],
      ["  const target = await bot.locate(frame);", "#a1d0a1"],
      ["  await arm.moveTo(target);", "#d8cfc0"],
      ["});", "#d8cfc0"],
      ["", null],
      ["// deploying to the edge…", "#6d6459"],
      ["bot.deploy();", "#d97951"],
    ],
  },
  {
    name: "arm.ts",
    lines: [
      ['import { Servo } from "./servo";', "#8b9bb4"],
      ["", null],
      ["const arm = new Arm({", "#d8cfc0"],
      ["  joints: [0, 90, 135],", "#e2a76f"],
      ["  gripper: 2,", "#d8cfc0"],
      ["});", "#d8cfc0"],
      ["", null],
      ["async function place(target) {", "#d8cfc0"],
      ["  await arm.plan(target);", "#a1d0a1"],
      ['  console.log("reaching", target);', "#d8cfc0"],
      ["  arm.actuate();", "#d97951"],
      ["}", "#d8cfc0"],
    ],
  },
  {
    name: "terminal",
    lines: [
      ["$ npm run deploy", "#c9c2b5"],
      ["> building vision-bot…", "#8f8577"],
      ["> optimizing yolov8.onnx", "#8f8577"],
      ["✓ deploy ready · 0.42s", "#a1d0a1"],
      ["$ watch sensors --stream", "#c9c2b5"],
      ["> camera 1 up · 30 fps", "#8f8577"],
      ["> arm servo 127.5°", "#8f8577"],
      ["✓ all systems nominal", "#a1d0a1"],
      ["$ ", "#c9c2b5"],
    ],
  },
];

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
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetX * 0.25, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetY * 0.15, 0.05);
  });

  return <group ref={ref}>{children}</group>;
}

function drawCode(
  ctx: CanvasRenderingContext2D,
  tabIdx: number,
  chars: number,
  cursorOn: boolean
) {
  const w = 1024;
  const h = 640;
  ctx.fillStyle = "#14110e";
  ctx.fillRect(0, 0, w, h);

  // title bar
  ctx.fillStyle = "#1d1813";
  ctx.fillRect(0, 0, w, 44);
  ctx.fillStyle = "#a94a2c";
  ctx.beginPath();
  ctx.arc(30, 22, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d97951";
  ctx.beginPath();
  ctx.arc(58, 22, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6d6459";
  ctx.beginPath();
  ctx.arc(86, 22, 8, 0, Math.PI * 2);
  ctx.fill();

  // tabs
  const tabs = TABS;
  let tabX = 110;
  ctx.font = "600 17px Consolas, Menlo, monospace";
  tabs.forEach((tab, i) => {
    const tw = ctx.measureText(tab.name).width + 30;
    ctx.fillStyle = i === tabIdx ? "#221c16" : "#1d1813";
    ctx.fillRect(tabX, 0, tw, 44);
    ctx.fillStyle = i === tabIdx ? "#d8cfc0" : "#72695c";
    ctx.fillText(tab.name, tabX + 15, 29);
    if (i === tabIdx) {
      ctx.fillStyle = "#d97951";
      ctx.fillRect(tabX + 15, 40, ctx.measureText(tab.name).width, 3);
    }
    tabX += tw;
  });

  // editor lines
  const font = "18px Consolas, Menlo, monospace";
  ctx.font = font;
  const startY = 96;
  const lineH = 36;
  let remaining = chars;
  let cursor = { x: 0, y: startY, shown: cursorOn };
  let maxX = 0;
  const tab = tabs[tabIdx];
  for (let li = 0; li < tab.lines.length && remaining >= 0; li++) {
    const [text, color] = tab.lines[li];
    const show = text ? text.slice(0, Math.min(remaining, text.length)) : "";
    if (text) {
      ctx.fillStyle = "#4c463f";
      ctx.fillText(String(li + 1).padStart(2, " "), 22, startY + li * lineH);
      ctx.fillStyle = color as string;
      ctx.fillText(show, 62, startY + li * lineH);
      maxX = Math.max(maxX, 62 + ctx.measureText(show).width);
    } else {
      ctx.fillStyle = "#4c463f";
      ctx.fillText(String(li + 1).padStart(2, " "), 22, startY + li * lineH);
      maxX = Math.max(maxX, 62);
    }
    remaining -= text ? text.length + 1 : 1;
    if (remaining >= 0 || !text) {
      cursor = { x: text ? 62 + ctx.measureText(show).width : 62, y: startY + li * lineH, shown: cursorOn };
    }
  }
  // cursor block at current typing position
  if (cursorOn) {
    ctx.fillStyle = "#e08a3c";
    ctx.fillRect(cursor.x, cursor.y - 15, 10, 19);
  }
}

function useCodeScreen(openRef: React.RefObject<boolean>, reduced: boolean) {
  const state = useRef({ tab: 0, chars: 0, cursor: true, holdUntil: 0 });

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);

  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    textureRef.current = texture;
    return () => {
      textureRef.current = null;
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }, delta) => {
    const tex = textureRef.current;
    if (!tex) return;
    if (!openRef.current && !reduced) {
      return;
    }
    const s = state.current;
    if (reduced) {
      const total = TABS[s.tab].lines.reduce((a, l) => a + (l[0] ? l[0].length : 1) + 1, 0);
      s.chars = total;
    } else {
      const total = TABS[s.tab].lines.reduce((a, l) => a + (l[0] ? l[0].length : 1) + 1, 0);
      if (s.chars < total) {
        s.chars = Math.min(total, s.chars + 60 * delta);
      } else if (clock.elapsedTime >= s.holdUntil) {
        s.tab = (s.tab + 1) % TABS.length;
        s.chars = 0;
        s.holdUntil = clock.elapsedTime + 2.6;
      }
    }
    s.cursor = Math.floor(clock.elapsedTime * 1.6) % 2 === 0;
    const ctx = (tex.image as HTMLCanvasElement).getContext("2d");
    if (ctx) drawCode(ctx, s.tab, Math.floor(s.chars), s.cursor);
    tex.needsUpdate = true;
  });

  return texture;
}

function Laptop() {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const codeRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const codeMat = useRef<THREE.MeshBasicMaterial>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const openRef = useRef(false);

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
  const screenUp = useMemo(
    () => new THREE.Vector3(0, 1, 0).applyQuaternion(screenQuat),
    [screenQuat]
  );

  const panelGeom = useMemo(() => {
    const g = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
    g.translate(0, PANEL_H / 2, 0);
    return g;
  }, []);
  const codeGeom = useMemo(() => {
    const g = new THREE.PlaneGeometry(CODE_W, CODE_H);
    g.translate(0, CODE_H / 2, 0);
    return g;
  }, []);
  const flashGeom = useMemo(() => {
    const g = new THREE.PlaneGeometry(PANEL_W * 1.04, PANEL_H * 1.06);
    g.translate(0, PANEL_H * 1.06 / 2, 0);
    return g;
  }, []);

  const screenCenter = useMemo(
    () => new THREE.Vector3(...SCREEN_CENTER),
    []
  );

  const codeTexture = useCodeScreen(openRef, reduced);

  useEffect(() => {
    const g = group.current;
    if (!g) return;
    if (reduced) {
      g.rotation.x = 0.06;
      g.position.y = 0;
      if (panelRef.current) panelRef.current.scale.y = 1;
      if (codeRef.current) codeRef.current.scale.y = 1;
      if (codeMat.current) codeMat.current.opacity = 1;
      if (glowRef.current) glowRef.current.intensity = 0.55;
      openRef.current = true;
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = (now - start) / 1000;
      const openT = THREE.MathUtils.clamp((t - 0.3) / 1.5, 0, 1);
      const eased = 1 - Math.pow(1 - openT, 3);
      g.rotation.x = THREE.MathUtils.lerp(1.05, 0.06, eased);
      g.position.y = THREE.MathUtils.lerp(-0.5, 0, eased);
      const rise = THREE.MathUtils.clamp((openT - 0.35) / 0.5, 0, 1);
      const riseEased = 1 - Math.pow(1 - rise, 2);
      if (panelRef.current) panelRef.current.scale.y = THREE.MathUtils.lerp(0.03, 1, riseEased);
      if (codeRef.current) codeRef.current.scale.y = THREE.MathUtils.lerp(0.03, 1, riseEased);
      const on = THREE.MathUtils.clamp((openT - 0.55) / 0.3, 0, 1);
      const flash = Math.sin(on * Math.PI);
      if (flashRef.current && flashMat.current)
        flashMat.current.opacity = flash * 0.7;
      if (glowRef.current) glowRef.current.intensity = 0.55 + flash * 1.3;
      if (codeMat.current)
        codeMat.current.opacity = Math.min(1, THREE.MathUtils.clamp((openT - 0.6) / 0.4, 0, 1) + flash * 0.2);
      if (openT >= 1) {
        openRef.current = true;
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => () => {
    panelGeom.dispose();
    codeGeom.dispose();
    flashGeom.dispose();
  }, [panelGeom, codeGeom, flashGeom]);

  return (
    <group rotation={[0.06, -0.58, 0]} position={[0.15, 0.25, 0]}>
      <group ref={group} rotation={[1.05, 0, 0]}>
        <primitive object={model} />
        <mesh ref={panelRef} position={screenCenter.clone().addScaledVector(screenUp, -PANEL_H / 2)} quaternion={screenQuat} scale={[1, 0.03, 1]}>
          <primitive object={panelGeom} attach="geometry" />
          <meshStandardMaterial color="#0d0b09" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh
          ref={codeRef}
          position={screenCenter.clone().addScaledVector(screenUp, -CODE_H / 2)}
          quaternion={screenQuat}
          scale={[1, 0.03, 1]}
        >
          <primitive object={codeGeom} attach="geometry" />
          <meshBasicMaterial ref={codeMat} map={codeTexture} toneMapped={false} transparent opacity={0} />
        </mesh>
        <mesh
          ref={flashRef}
          position={screenCenter
            .clone()
            .addScaledVector(screenUp, -PANEL_H / 2)
            .addScaledVector(new THREE.Vector3(...SCREEN_NORMAL), 0.03)}
          quaternion={screenQuat}
          scale={[1, 0.03, 1]}
        >
          <primitive object={flashGeom} attach="geometry" />
          <meshBasicMaterial
            ref={flashMat}
            color="#ff9a5c"
            toneMapped={false}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight
          ref={glowRef}
          position={[0, 0, SCREEN_CENTER[2] + 0.7]}
          intensity={0.55}
          distance={3.5}
          color="#d97951"
        />
      </group>
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
        <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.22} floatIntensity={0.6}>
          <Suspense fallback={null}>
            <Laptop />
          </Suspense>
        </Float>
      </Rig>

      <ContactShadows position={[0, -1.35, 0]} opacity={0.32} scale={11} blur={2.8} far={5} />
      <Sparkles count={70} scale={9} size={2} speed={reduced ? 0 : 0.35} opacity={0.4} color="#d97951" />
    </Canvas>
  );
}
