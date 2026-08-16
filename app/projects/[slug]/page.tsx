import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { getProject, projects } from "@/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.name ?? "Project" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-20 sm:py-28">
      <Reveal>
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          ← All projects
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-cream-2/60 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: project.accent }}
          />
          <p className="font-mono text-sm text-accent">{project.category}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {project.summary}
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-12 sm:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <h2 className="mb-5 font-display text-2xl font-semibold text-ink">
            About this project
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            {project.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {project.highlights && (
            <>
              <h2 className="mb-4 mt-10 font-display text-2xl font-semibold text-ink">
                Highlights
              </h2>
              <ul className="space-y-2.5">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-muted">
                    <span className="mt-0.5 text-accent">✦</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>

        <aside className="sm:sticky sm:top-24 sm:self-start">
          <Reveal delay={0.1}>
            <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-sm text-ink-2"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm text-paper transition-colors hover:bg-accent"
                >
                  GitHub ↗
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-ink/20 px-6 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  Live site ↗
                </a>
              )}
            </div>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
