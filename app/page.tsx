"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Parallax,
  Reveal,
  SplitText,
  Stagger,
  StaggerItem,
  heroVariants,
} from "@/components/motion";
import { Marquee } from "@/components/marquee";
import { PhotoStack } from "@/components/photo-stack";
import { ProjectCard } from "@/components/project-card";
import { FocusNotes } from "@/components/focus-notes";
import { profile } from "@/data/profile";
import { marqueeSkills } from "@/data/skills";
import { projects } from "@/data/projects";

const HeroScene = dynamic(() => import("@/components/scene-hero"), {
  ssr: false,
});

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 animate-drift rounded-full bg-coral/25 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-96 w-96 animate-drift rounded-full bg-violet/25 blur-3xl [animation-delay:-5s]" />
          <div className="absolute right-[-4%] bottom-16 h-72 w-72 animate-drift rounded-full bg-teal/20 blur-3xl [animation-delay:-11s]" />
          <div className="absolute left-[5%] top-[14%] animate-float font-display text-2xl text-coral/60">✦</div>
          <div className="absolute left-[40%] top-[10%] animate-slow-spin text-lg text-teal/60">◆</div>
          <div className="absolute left-[10%] bottom-[22%] animate-float text-xl text-violet/60 [animation-delay:-3s]">●</div>
          <div className="absolute left-[30%] bottom-[12%] animate-slow-spin text-sm text-rose/50 [animation-delay:-8s]">✦</div>
          <div className="absolute right-[7%] top-[9%] animate-slow-spin text-lg text-rose/50 [animation-delay:-6s]">✦</div>
          <div className="absolute right-[28%] top-[46%] animate-float text-sm text-gold/60 [animation-delay:-5s]">◆</div>
          <div className="absolute bottom-[8%] right-[32%] animate-float text-base text-lavender/60 [animation-delay:-2s]">●</div>
          <div className="absolute -left-8 bottom-0 h-72 w-72 bg-dots opacity-70" />
          <div className="absolute inset-y-0 right-0 hidden w-[56%] lg:block">
            <div className="absolute inset-0">
              <HeroScene />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cream to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-cream" />
        </div>

        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-14 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              custom={0}
              initial="hidden"
              animate="show"
              variants={heroVariants}
              className="mb-6 text-sm uppercase tracking-[0.3em] text-accent"
            >
              {profile.location}
            </motion.p>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="show"
              variants={heroVariants}
              className="font-display text-[clamp(3rem,9vw,6rem)] font-semibold leading-[1.05] tracking-tight text-ink"
            >
              {profile.name.split(" ")[0]}
              <br />
              <span className="bg-gradient-to-r from-coral via-rose to-violet bg-clip-text py-px italic text-transparent">
                {profile.name.split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="show"
              variants={heroVariants}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
            >
              {profile.role}. {profile.bio[0]}
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="show"
              variants={heroVariants}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/projects"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 text-sm font-medium text-paper shadow-lg shadow-accent/30 transition-all hover:from-accent-2 hover:to-accent hover:shadow-accent/40"
              >
                View my work
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-full border border-accent/30 px-7 text-sm font-medium text-ink transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                Contact me
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="justify-self-center lg:justify-self-end"
          >
            <Parallax offset={20}>
              <PhotoStack />
            </Parallax>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px bg-ink/40"
          />
        </motion.div>
      </section>

      <Marquee items={marqueeSkills} />

      {/* ── Featured projects ─────────────────── */}
      <section className="relative mx-auto w-full max-w-5xl px-5 py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-4 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/5 blur-3xl" />
        </div>
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-sm text-coral">( Selected Work )</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                <SplitText text="Featured projects" />
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline sm:block"
            >
              All projects →
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} index={i} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            All projects →
          </Link>
        </div>
      </section>

      {/* ── What I do ─────────────────────────── */}
      <section className="relative border-t border-line bg-cream-2/50">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-violet/15 blur-3xl" />
          <div className="absolute -right-16 top-2/3 h-72 w-72 rounded-full bg-coral/15 blur-3xl" />
          <div className="absolute right-[12%] top-[14%] animate-float text-lg text-teal/50">✦</div>
          <div className="absolute left-[10%] bottom-[12%] animate-slow-spin text-sm text-gold/50 [animation-delay:-7s]">◆</div>
        </div>
        <div className="relative mx-auto w-full max-w-5xl px-5 py-24">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-violet">( Focus )</p>
            <h2 className="mb-12 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              What I do
            </h2>
          </Reveal>

          <FocusNotes />
        </div>
      </section>

      {/* ── About preview ──────────────────────── */}
      <section className="relative mx-auto w-full max-w-5xl px-5 py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-rose/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-56 w-56 rounded-full bg-sky/10 blur-3xl" />
        </div>
        <div className="grid gap-10 sm:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-teal">( About )</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">
              Engineer. Builder.{" "}
              <span className="bg-gradient-to-r from-teal via-lavender to-violet bg-clip-text py-px italic text-transparent">
                Roboticist.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-muted">
              {profile.bio.join(" ")}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm text-accent underline-offset-4 hover:underline"
            >
              Read the full story →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Contact CTA ────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-72 w-72 animate-drift rounded-full bg-violet/25 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-72 w-72 animate-drift rounded-full bg-teal/25 blur-3xl [animation-delay:-8s]" />
            <div className="absolute right-0 top-1/2 h-64 w-64 animate-drift rounded-full bg-rose/15 blur-3xl [animation-delay:-13s]" />
            <div className="absolute left-[15%] top-[18%] animate-float font-display text-2xl text-coral/50">✦</div>
            <div className="absolute right-[18%] bottom-[20%] animate-slow-spin text-lg text-lavender/50 [animation-delay:-9s]">◆</div>
            <div className="absolute left-[30%] bottom-[10%] animate-float text-base text-sky/50 [animation-delay:-4s]">●</div>
        </div>
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center">
          <Reveal>
            <p className="mb-4 font-mono text-sm text-rose">( Contact )</p>
              <h2 className="mx-auto max-w-2xl font-display text-5xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
              Have an idea?{" "}
              <span className="bg-gradient-to-r from-coral via-rose to-violet bg-clip-text py-px italic text-transparent">
                Let&apos;s build it.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Open to internships, robotics & vision work, and full-stack
              projects. Tell me what you&apos;re making.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-8 text-sm font-medium text-paper shadow-lg shadow-accent/30 transition-all hover:from-accent-2 hover:to-accent hover:shadow-accent/40"
              >
                Get in touch
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-12 items-center rounded-full border border-accent/30 px-8 text-sm font-medium text-ink transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {profile.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
