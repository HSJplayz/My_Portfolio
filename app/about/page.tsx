import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Marquee } from "@/components/marquee";
import { profile } from "@/data/profile";
import { skillGroups, marqueeSkills } from "@/data/skills";
import { certifications, languages, activities } from "@/data/certifications";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Reveal>
            <div className="mx-auto w-full max-w-xs lg:mx-0">
              <div className="rotate-2 rounded-sm bg-paper p-3 pb-5 shadow-card transition-transform duration-300 hover:rotate-0">
                <div className="overflow-hidden rounded-xs bg-cream-2">
                  <Image
                    src="/photos/photo-1.jpg"
                    alt={profile.name}
                    width={512}
                    height={640}
                    sizes="(max-width: 1024px) 80vw, 320px"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <p className="pt-2 text-center font-display text-sm italic tracking-wide text-ink-2">
                  Hrushikesh Jagtap — B.Tech CE, PCCOE
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mb-4 font-mono text-sm text-accent">( About )</p>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Hrushikesh Jagtap
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {profile.bio.map((p, i) => (
                <span key={i} className={i > 0 ? "mt-3 block" : ""}>
                  {p}
                </span>
              ))}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-3 font-mono text-sm text-muted sm:grid-cols-2">
          <Reveal className="rounded-xl border border-line bg-cream-2/50 px-5 py-4">
            <span className="text-accent">location</span> — {profile.location}
          </Reveal>
          <Reveal delay={0.06} className="rounded-xl border border-line bg-cream-2/50 px-5 py-4">
            <span className="text-accent">status</span> — B.Tech Computer Engg., graduating 2028
          </Reveal>
          <Reveal delay={0.12} className="rounded-xl border border-line bg-cream-2/50 px-5 py-4">
            <span className="text-accent">email</span> —{" "}
            <a href={`mailto:${profile.email}`} className="text-ink underline-offset-4 hover:text-accent hover:underline">
              {profile.email}
            </a>
          </Reveal>
          <Reveal delay={0.18} className="rounded-xl border border-line bg-cream-2/50 px-5 py-4">
            <span className="text-accent">leetcode</span> —{" "}
            <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" className="text-ink underline-offset-4 hover:text-accent hover:underline">
              {profile.leetcodeName}
            </a>
          </Reveal>
        </div>
      </section>

      <Marquee items={marqueeSkills} />

      {/* Skills */}
      <section className="mx-auto w-full max-w-5xl px-5 py-24">
        <Reveal>
          <h2 className="mb-12 font-display text-4xl font-semibold tracking-tight text-ink">
            Skills
          </h2>
        </Reveal>
        <Stagger className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <StaggerItem key={group.title}>
              <div className="border-t border-line pt-5">
                <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-accent hover:text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Certifications & more */}
      <section className="border-t border-line bg-cream-2/50">
        <div className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-24 md:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-ink">
                Certifications
              </h2>
            </Reveal>
            <Stagger className="space-y-4">
              {certifications.map((cert) => (
                <StaggerItem key={cert.name}>
                  <div className="rounded-xl border border-line bg-paper px-5 py-4">
                    <p className="text-ink">{cert.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{cert.issuer}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="space-y-10">
            <div>
              <Reveal>
                <h2 className="mb-6 font-display text-3xl font-semibold tracking-tight text-ink">
                  Languages
                </h2>
              </Reveal>
              <Stagger className="space-y-3">
                {languages.map((lang) => (
                  <StaggerItem key={lang.name}>
                    <div className="flex items-baseline justify-between border-b border-line pb-2">
                      <span className="text-ink">{lang.name}</span>
                      <span className="text-sm italic text-muted">{lang.level}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div>
              <Reveal>
                <h2 className="mb-6 font-display text-3xl font-semibold tracking-tight text-ink">
                  Beyond code
                </h2>
              </Reveal>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <span
                    key={activity}
                    className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-2"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
