import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import WindingTimeline from "@/components/winding-timeline";
import type { RoadmapItem } from "@/components/winding-timeline";
import { experience, education } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
};

const roadmap: RoadmapItem[] = [
  ...education.map((e) => ({ ...e, type: "education" as const })),
  ...experience.map((e) => ({ ...e, type: "experience" as const })),
];

export default function ExperiencePage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:py-28">
      <Reveal>
        <p className="mb-4 font-mono text-sm text-accent">( Journey )</p>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          Experience
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Engineering robots that see, documentation that communicates, and a
          CS foundation being built at PCCOE.
        </p>
      </Reveal>

      <div className="mt-16">
        <WindingTimeline items={roadmap} />
      </div>
    </section>
  );
}
