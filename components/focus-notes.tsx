import type { CSSProperties } from "react";

const notes = [
  {
    n: "01",
    title: "Computer Vision & ML",
    tag: "YOLO · OpenCV · Scikit-learn",
    description:
      "Custom object-detection pipelines, dataset curation, augmentation, and real-time vision that ships onto hardware.",
    a: -6,
    b: 3.8,
    duration: 4.6,
    delay: 0,
    color: "#6d5bd0",
    line: "rgba(109,91,208,0.35)",
  },
  {
    n: "02",
    title: "Full-Stack Development",
    tag: "React · Next.js · Node · SQL",
    description:
      "Algorithm-first platforms and database-backed web apps — from problem sets and submissions to recipes and ratings.",
    a: 5.2,
    b: -4,
    duration: 5.2,
    delay: -1.4,
    color: "#0f766e",
    line: "rgba(15,118,110,0.35)",
  },
  {
    n: "03",
    title: "Robotics & Hardware",
    tag: "Arduino · ESP32 · Sensors",
    description:
      "Bridging vision to actuation — cameras that see, microcontrollers that decide, and arms that move.",
    a: -4.4,
    b: 5.6,
    duration: 4.9,
    delay: -2.8,
    color: "#e0653f",
    line: "rgba(224,101,63,0.35)",
  },
];

export function FocusNotes() {
  return (
    <div className="grid gap-12 md:grid-cols-3 md:gap-8">
      {notes.map((note) => (
        <div
          key={note.title}
          className="group relative z-0 hover:z-10"
          style={{ "--sa-base": `${note.a}deg`, "--sb-base": `${note.b}deg` } as CSSProperties}
        >
          <div
            className="note-swing relative h-80 rounded-[3px]"
            style={
              {
                background: `#f8f2e3`,
                backgroundImage: `linear-gradient(to right, transparent 34px, ${note.line} 34px, ${note.line} 35px, transparent 35px), repeating-linear-gradient(to bottom, transparent 0 31px, rgba(150,130,100,0.32) 31px 32px)`,
                boxShadow:
                  "0 2px 4px rgba(27,23,19,0.12), 0 18px 40px -18px rgba(27,23,19,0.35)",
                animationDuration: `${note.duration}s`,
                animationDelay: `${note.delay}s`,
              } as CSSProperties
            }
          >
            <div
              aria-hidden
              className="absolute -top-2.5 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-2 rounded-[2px] bg-white/45 shadow-sm"
            />
            <div className="flex h-full flex-col px-8 pt-9 pb-6">
              <span className="font-mono text-xs" style={{ color: note.color }}>{note.n}</span>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
                {note.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2/85">
                {note.description}
              </p>
              <p className="mt-auto border-t border-ink/10 pt-3 font-mono text-xs" style={{ color: note.color }}>
                {note.tag}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
