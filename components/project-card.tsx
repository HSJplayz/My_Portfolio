import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-line bg-cream-2/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-ink/10"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: project.accent }}
      />
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-muted">
          {project.category}
        </span>
      </div>

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
    </Link>
  );
}
