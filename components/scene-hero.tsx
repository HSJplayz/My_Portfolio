"use client";

// Laptop model: "Laptop" by Poly by Google — poly.pizza/m/6eBS-C3E33W — CC-BY 3.0.
// https://creativecommons.org/licenses/by/3.0/

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles, useGLTF } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

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

function useCodeScreen() {
  const state = useRef({ tab: 0, chars: 0, cursor: true, startAt: 0, holdUntil: Infinity });
  const clockRef = useRef<THREE.Clock | null>(null);
  const lastSig = useRef("");

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

  useFrame(({ clock }) => {
    clockRef.current = clock;
    const tex = textureRef.current;
    if (!tex) return;
    const s = state.current;
    const t = clock.getElapsedTime();
    const rate = 16;
    const total = TABS[s.tab].lines.reduce((a, l) => a + (l[0] ? l[0].length : 1) + 1, 0);
    if (t < s.startAt + total / rate) {
      s.chars = Math.floor((t - s.startAt) * rate);
    } else {
      s.chars = total;
      if (t >= s.holdUntil) {
        s.tab = (s.tab + 1) % TABS.length;
        const nextTotal = TABS[s.tab].lines.reduce((a, l) => a + (l[0] ? l[0].length : 1) + 1, 0);
        s.startAt = t;
        s.holdUntil = t + nextTotal / rate + 2;
        s.chars = 0;
      }
    }
    const sig = `${s.tab}|${Math.floor(s.chars)}`;
    if (sig === lastSig.current) return;
    lastSig.current = sig;
    const ctx = (tex.image as HTMLCanvasElement).getContext("2d");
    if (ctx) drawCode(ctx, s.tab, Math.floor(s.chars), true);
    tex.needsUpdate = true;
  });

  const reset = useCallback(() => {
    const t = clockRef.current?.getElapsedTime() ?? 0;
    state.current = { tab: 0, chars: 0, cursor: true, startAt: t, holdUntil: Infinity };
    lastSig.current = "";
  }, []);

  return { texture, reset };
}

type Anim = { code: number; glow: number; flash: number; rotY: number };

function Laptop() {
  const group = useRef<THREE.Group>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const codeRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const codeMat = useRef<THREE.MeshBasicMaterial>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

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
  const screenCenter = useMemo(() => new THREE.Vector3(...SCREEN_CENTER), []);

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

  const { texture: codeTexture, reset: resetTyping } = useCodeScreen();

  const anim = useRef<Anim>({ code: 0, glow: 0, flash: 0, rotY: 0 });
  const powered = useRef(false);
  const transitioning = useRef(false);
  const tweenId = useRef(0);

const apply = useCallback(() => {
    const a = anim.current;
    if (group.current) {
      group.current.rotation.y = a.rotY;
    }
    if (codeMat.current) {
      codeMat.current.opacity = a.code;
      const wantOpaque = a.code >= 0.999;
      if (codeMat.current.transparent === wantOpaque) {
        codeMat.current.transparent = !wantOpaque;
        codeMat.current.needsUpdate = true;
      }
    }
    if (glowRef.current) glowRef.current.intensity = a.glow;
    if (flashMat.current) flashMat.current.opacity = a.flash;
    if (flashRef.current) flashRef.current.visible = a.flash > 0.01;
  }, []);

  const tweenTo = useCallback(
    (to: Partial<Anim>, dur: number, onDone?: () => void) => {
      const id = ++tweenId.current;
      const from: Partial<Anim> = {};
      for (const k of Object.keys(to) as (keyof Anim)[]) from[k] = anim.current[k];
      const start = performance.now();
      const step = (now: number) => {
        if (id !== tweenId.current) return;
        const t = Math.min((now - start) / (dur * 1000), 1);
        const e = 1 - Math.pow(1 - t, 3);
        for (const k of Object.keys(to) as (keyof Anim)[]) {
          anim.current[k] = THREE.MathUtils.lerp(from[k] as number, to[k] as number, e);
        }
        apply();
        if (t < 1) requestAnimationFrame(step);
        else if (onDone) onDone();
      };
      requestAnimationFrame(step);
    },
    [apply]
  );

  const flashBurst = useCallback(
    (dur = 0.35, peak = 0.75) => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / (dur * 1000), 1);
        anim.current.flash = Math.sin(t * Math.PI) * peak;
        apply();
        if (t < 1) requestAnimationFrame(step);
        else anim.current.flash = 0;
      };
      requestAnimationFrame(step);
    },
    [apply]
  );

  const powerOff = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    flashBurst(0.3, 0.85);
    tweenTo({ code: 0, glow: 0, rotY: -0.15 }, 0.4, () => {
      tweenTo({ rotY: 0 }, 0.3, () => {
        transitioning.current = false;
        powered.current = false;
      });
    });
  }, [flashBurst, tweenTo]);

  const powerOn = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    resetTyping();
    tweenTo({ code: 1, glow: 0.55, rotY: 0.15 }, 0.4, () => {
      flashBurst(0.3, 0.7);
      tweenTo({ rotY: 0 }, 0.3, () => {
        transitioning.current = false;
        powered.current = true;
      });
    });
  }, [flashBurst, resetTyping, tweenTo]);

  const togglePower = useCallback(() => {
    if (transitioning.current) return;
    if (powered.current) powerOff();
    else powerOn();
  }, [powerOff, powerOn]);

  useEffect(() => {
    const startedAt = tweenId.current;
    tweenTo({ code: 1, glow: 0.55, rotY: 0.12 }, 1.2, () => {
      flashBurst(0.3, 0.7);
      tweenTo({ rotY: 0 }, 0.4, () => {
        resetTyping();
        powered.current = true;
      });
    });
    return () => {
      tweenId.current = startedAt + 1;
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useEffect(
    () => () => {
      panelGeom.dispose();
      codeGeom.dispose();
      flashGeom.dispose();
    },
    [panelGeom, codeGeom, flashGeom]
  );

  const normal = useMemo(() => new THREE.Vector3(...SCREEN_NORMAL).normalize(), []);
  const panelPos = useMemo(
    () => screenCenter.clone().addScaledVector(screenUp, -PANEL_H / 2).addScaledVector(normal, 0.02),
    [screenCenter, screenUp, normal]
  );
  const codePos = useMemo(
    () => screenCenter.clone().addScaledVector(screenUp, -CODE_H / 2).addScaledVector(normal, 0.04),
    [screenCenter, screenUp, normal]
  );
  const flashPos = useMemo(
    () => screenCenter.clone().addScaledVector(screenUp, -PANEL_H / 2).addScaledVector(normal, 0.06),
    [screenCenter, screenUp, normal]
  );

  return (
    <group rotation={[0.04, -0.85, 0]} position={[0.6, -0.15, 0]}>
      <group ref={group} rotation={[0.35, 0, 0]}>
        <primitive
          object={model}
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            togglePower();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
        <mesh ref={panelRef} position={panelPos} quaternion={screenQuat} renderOrder={0}>
          <primitive object={panelGeom} attach="geometry" />
          <meshStandardMaterial color="#0d0b09" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh ref={codeRef} position={codePos} quaternion={screenQuat} renderOrder={1}>
          <primitive object={codeGeom} attach="geometry" />
          <meshBasicMaterial ref={codeMat} map={codeTexture} toneMapped={false} transparent opacity={0} />
        </mesh>
        <mesh
          ref={flashRef}
          position={flashPos}
          quaternion={screenQuat}
          renderOrder={2}
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
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "auto" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#ffe2c0" />
      <directionalLight position={[-3, 2, -3]} intensity={0.7} color="#d97951" />
      <directionalLight position={[0, 3, 6]} intensity={1.1} color="#fff0e0" />
      <pointLight position={[-2, 1.5, 3.5]} intensity={0.5} color="#d97951" />

      <Float speed={1.2} rotationIntensity={0.22} floatIntensity={0.6}>
        <Suspense fallback={null}>
          <Laptop />
        </Suspense>
      </Float>

      <ContactShadows position={[0, -1.35, 0]} opacity={0.32} scale={11} blur={2.8} far={5} />
      <Sparkles count={70} scale={9} size={2} speed={0.35} opacity={0.4} color="#d97951" />
    </Canvas>
  );
}
