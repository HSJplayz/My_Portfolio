"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from "motion/react";
import { useRef, useState, useEffect, type ReactNode } from "react";
import type { TimelineItem } from "@/data/experience";

const ease = [0.22, 1, 0.36, 1] as const;

export type RoadmapItem = TimelineItem & {
  type?: "education" | "experience";
};

/* ── SVG Winding Path ────────────────────────────────────── */

function WindingPath({
  nodeYPositions,
  totalHeight,
  pathDrawn,
}: {
  nodeYPositions: number[];
  totalHeight: number;
  pathDrawn: MotionValue<number>;
}) {
  if (totalHeight === 0 || nodeYPositions.length === 0) return null;

  const cx = 50;
  const sway = 16;

  let d = `M ${cx} 0`;
  for (let i = 0; i < nodeYPositions.length; i++) {
    const y = nodeYPositions[i];
    const prevY = i === 0 ? 0 : nodeYPositions[i - 1];
    const midY = (prevY + y) / 2;
    const dx = i % 2 === 0 ? -sway : sway;
    d += ` C ${cx + dx} ${midY}, ${cx + dx} ${midY}, ${cx} ${y}`;
  }
  d += ` L ${cx} ${totalHeight}`;

  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
      viewBox={`0 0 100 ${totalHeight}`}
      preserveAspectRatio="none"
      style={{ width: 64, height: totalHeight }}
      aria-hidden
    >
      <motion.path
        d={d}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: pathDrawn }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeOpacity={0.15}
        style={{ pathLength: pathDrawn }}
      />
    </svg>
  );
}

/* ── Timeline Node ───────────────────────────────────────── */

function TimelineNode({ type }: { type?: "education" | "experience" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative z-10 flex h-6 w-6 items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 18,
        delay: 0.1,
      }}
    >
      {/* pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/20"
        animate={
          inView
            ? { scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }
            : {}
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* core */}
      <div
        className={`h-3.5 w-3.5 rounded-full border-[2.5px] ${
          type === "education"
            ? "border-teal bg-cream"
            : "border-accent bg-cream"
        }`}
      />
    </motion.div>
  );
}

/* ── Timeline Card ───────────────────────────────────────── */

function TimelineCard({
  item,
  side,
}: {
  item: RoadmapItem;
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === "left" ? -36 : 36, y: 12 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className="group w-full max-w-md rounded-xl bg-paper p-5 shadow-card transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-accent">{item.period}</span>
        {item.type && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              item.type === "education"
                ? "bg-teal/10 text-teal"
                : "bg-accent/10 text-accent"
            }`}
          >
            {item.type}
          </span>
        )}
        {item.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cream-2 px-2.5 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl">
        {item.title}
      </h3>
      <p className="mt-0.5 text-sm text-muted">{item.org}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-muted leading-relaxed">
        {item.description.map((line) => (
          <li key={line} className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 text-accent">✦</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Road‑start / Road‑end markers ───────────────────────── */

function RoadMarker({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease }}
      className="flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export default function WindingTimeline({
  items,
}: {
  items: RoadmapItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodeYPositions, setNodeYPositions] = useState<number[]>([]);
  const [totalHeight, setTotalHeight] = useState(0);

  /* Measure card positions after layout */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const positions = rowRefs.current.map((row) => {
        if (!row) return 0;
        const r = row.getBoundingClientRect();
        return r.top - containerRect.top + r.height / 2;
      });
      setNodeYPositions(positions);
      setTotalHeight(container.scrollHeight);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [items.length]);

  /* Scroll-linked path drawing */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 25%"],
  });
  const pathDrawn = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl">
      {/* Winding SVG path */}
      <WindingPath
        nodeYPositions={nodeYPositions}
        totalHeight={totalHeight}
        pathDrawn={pathDrawn}
      />

      {/* Road start marker */}
      <RoadMarker>
        <div className="mb-2 flex items-center gap-2 rounded-full bg-cream-2 px-4 py-1.5 font-mono text-xs text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          The journey begins
        </div>
      </RoadMarker>

      {/* Timeline rows */}
      <div className="relative mt-4 space-y-5">
        {items.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={`${item.title}-${item.period}`}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="relative flex items-center"
            >
              {/* Left content */}
              <div
                className={`w-1/2 ${isLeft ? "flex justify-end pr-7" : ""}`}
              >
                {isLeft && <TimelineCard item={item} side="left" />}
              </div>

              {/* Center node */}
              <div className="relative z-10 flex w-0 flex-shrink-0 justify-center">
                <TimelineNode type={item.type} />
              </div>

              {/* Right content */}
              <div
                className={`w-1/2 ${!isLeft ? "flex justify-start pl-7" : ""}`}
              >
                {!isLeft && <TimelineCard item={item} side="right" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Road end marker */}
      <RoadMarker>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-cream-2 px-4 py-1.5 font-mono text-xs text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal" />
          Still building…
        </div>
      </RoadMarker>
    </div>
  );
}
