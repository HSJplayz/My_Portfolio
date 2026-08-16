import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { ProjectsGrid } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: "Work",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:py-28">
      <Reveal>
        <p className="mb-4 font-mono text-sm text-accent">( Work )</p>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          Projects
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Full-stack platforms, algorithm engines, database systems, hackathon
          builds, and game experiments — built to solve real problems and push
          what I know.
        </p>
      </Reveal>

      <ProjectsGrid />
    </section>
  );
}
