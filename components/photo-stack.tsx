"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { profile } from "@/data/profile";
import { asset } from "@/lib/asset";

const FAN = 5;
const STACK_SIZE = 330;

export function PhotoStack() {
  const photos = profile.photos;
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [zoomed, setZoomed] = useState(false);
  const top = order.length - 1;
  const active = order[top];

  const bringToFront = (idx: number) =>
    setOrder((o) => {
      if (o[o.length - 1] === idx) {
        setZoomed((z) => !z);
        return o;
      }
      setZoomed(true);
      return [...o.filter((x) => x !== idx), idx];
    });

  const cycle = (dir: 1 | -1) => {
    setZoomed(false);
    bringToFront((active + dir + photos.length) % photos.length);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: STACK_SIZE, height: STACK_SIZE * 1.18 }}
      >
        <div
          aria-hidden
          className="absolute inset-4 animate-pulse-ring rounded-full bg-accent/10 blur-2xl"
        />
        {photos.map((photo, originalIdx) => {
          const p = order.indexOf(originalIdx);
          const depth = top - p;
          const isTop = depth === 0;
          return (
            <div
              key={photo.src}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: p }}
            >
              <motion.button
                type="button"
                onClick={() => bringToFront(originalIdx)}
                aria-label={`Bring photo ${originalIdx + 1} to front`}
                animate={{
                  rotate: depth * FAN * (p % 2 === 0 ? -1 : 1),
                  x: depth * 10,
                  y: -depth * 4,
                  scale: isTop && zoomed ? 1.12 : 1 - depth * 0.05,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                className="group block w-[min(72vw,270px)] cursor-pointer rounded-sm bg-paper p-3 pb-2 text-left shadow-card transition-shadow hover:shadow-lift"
              >
                <div className="relative overflow-hidden rounded-xs bg-cream-2">
                  <Image
                    src={asset(photo.src)}
                    alt={`${profile.name} — photo ${originalIdx + 1}`}
                    width={512}
                    height={640}
                    sizes="(max-width: 768px) 72vw, 270px"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {photo.caption && (
                  <p
                    className={`pt-2 font-display text-sm italic tracking-wide text-ink-2 transition-opacity ${
                      isTop ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    {photo.caption}
                  </p>
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <StackButton onClick={() => cycle(-1)} ariaLabel="Previous photo">
          ←
        </StackButton>
        <p className="w-24 text-center font-mono text-xs text-muted">
          {active + 1} / {photos.length}
        </p>
        <StackButton onClick={() => cycle(1)} ariaLabel="Next photo">
          →
        </StackButton>
      </div>
      <p className="mt-3 font-mono text-xs text-muted">
        Click a photo to zoom in on it
      </p>
    </div>
  );
}

function StackButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </button>
  );
}
