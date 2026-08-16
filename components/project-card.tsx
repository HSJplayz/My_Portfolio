import Link from "next/link";
import type { Project } from "@/data/projects";
import { TiltCard } from "@/components/motion";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <TiltCard className="h-full" maxTilt={5}>
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-shadow duration-300 hover:shadow-lift"
      >
        {/* Generated cover */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div
            className="absolute inset-0 opacity-90 transition-transform duration-700 group-hover:scale-110"
            style={{
              background: `radial-gradient(120% 140% at 20% 0%, ${project.accent} 0%, transparent 60%), linear-gradient(135deg, ${project.accent} 0%, ${project.accent}cc 100%)`,
            }}
          />
          <div
            aria-hidden
            className="absolute -right-6 -top-6 h-32 w-32 rounded-full border border-white/20 blur-[1px] transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-black/10 blur-xl"
          />
          <span className="absolute left-5 top-4 font-mono text-sm text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute right-5 top-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {project.category}
          </span>
          <span
            aria-hidden
            className="absolute -bottom-4 right-3 select-none font-display text-7xl font-semibold italic leading-none text-white/15 transition-transform duration-500 group-hover:-translate-y-1"
          >
            ✦
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
            {project.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink-2"
              >
                {tech}
              </span>
            ))}
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent">
            View project
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
