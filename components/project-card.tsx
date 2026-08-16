import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { TiltCard } from "@/components/motion";
import { asset } from "@/lib/asset";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <TiltCard className="h-full" maxTilt={5}>
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-shadow duration-300 hover:shadow-lift"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${project.accent} 0%, ${project.accent}cc 100%)`,
            }}
          />
          <Image
            src={asset(`/projects/${project.slug}.svg`)}
            alt={`${project.name} mockup`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute left-5 top-4 font-mono text-sm text-white/70 drop-shadow">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute right-5 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {project.category}
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

          <span
            className="mt-6 inline-flex items-center gap-1.5 text-sm transition-opacity group-hover:opacity-80"
            style={{ color: project.accent }}
          >
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
