import type { CSSProperties } from "react";

const notes = [
  {
    n: "01",
    title: "Computer Vision & ML",
    tag: "YOLO · OpenCV · Scikit-learn",
    description:
      "Custom object-detection pipelines, dataset curation, augmentation, and real-time vision that ships onto hardware.",
    a: -2.6,
    b: 1.6,
    duration: 5.4,
    delay: 0,
  },
  {
    n: "02",
    title: "Full-Stack Development",
    tag: "React · Next.js · Node · SQL",
    description:
      "Algorithm-first platforms and database-backed web apps — from problem sets and submissions to recipes and ratings.",
    a: 2.2,
    b: -1.8,
    duration: 6.1,
    delay: -1.4,
  },
  {
    n: "03",
    title: "Robotics & Hardware",
    tag: "Arduino · ESP32 · Sensors",
    description:
      "Bridging vision to actuation — cameras that see, microcontrollers that decide, and arms that move.",
    a: -1.9,
    b: 2.4,
    duration: 5.8,
    delay: -2.8,
  },
];

export function FocusNotes() {
  return (
    <div className="grid gap-12 md:grid-cols-3 md:gap-8">
      {notes.map((note) => (
        <div key={note.title} className="group relative z-0 hover:z-10">
          <div
            className="note-swing relative h-80 rounded-[3px]"
            style={
              {
                background: `#f8f2e3`,
                backgroundImage: `linear-gradient(to right, transparent 34px, rgba(192,84,58,0.3) 34px, rgba(192,84,58,0.3) 35px, transparent 35px), repeating-linear-gradient(to bottom, transparent 0 31px, rgba(150,130,100,0.32) 31px 32px)`,
                boxShadow:
                  "0 2px 4px rgba(27,23,19,0.12), 0 18px 40px -18px rgba(27,23,19,0.35)",
                "--swing-a": `${note.a}deg`,
                "--swing-b": `${note.b}deg`,
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
              <span className="font-mono text-xs text-accent">{note.n}</span>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
                {note.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2/85">
                {note.description}
              </p>
              <p className="mt-auto border-t border-ink/10 pt-3 font-mono text-xs text-accent-2">
                {note.tag}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
