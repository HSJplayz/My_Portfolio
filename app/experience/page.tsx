import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { experience, education } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencePage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-20 sm:py-28">
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
        <Reveal>
          <h2 className="mb-8 font-display text-3xl font-semibold text-ink">
            Education
          </h2>
        </Reveal>
        <Timeline items={education} />
      </div>

      <div className="mt-20">
        <Reveal>
          <h2 className="mb-8 font-display text-3xl font-semibold text-ink">
            Experience
          </h2>
        </Reveal>
        <Timeline items={experience} />
      </div>
    </section>
  );
}

function Timeline({ items }: { items: typeof experience }) {
  return (
    <div className="relative ml-3 border-l border-line pl-8">
      <Stagger className="space-y-12">
        {items.map((item) => (
          <StaggerItem key={`${item.title}-${item.period}`}>
            <div className="group relative rounded-xl p-4 -m-4 transition-colors duration-300 hover:bg-cream-2/50">
              <span
                aria-hidden
                className="absolute -left-[38px] top-6 h-2.5 w-2.5 rounded-full border-2 border-accent bg-cream transition-all duration-300 group-hover:scale-150 group-hover:bg-accent"
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-accent">{item.period}</span>
                {item.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cream-2 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted">{item.org}</p>
              <ul className="mt-4 space-y-2 text-muted leading-relaxed">
                {item.description.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-0.5 text-accent">✦</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
