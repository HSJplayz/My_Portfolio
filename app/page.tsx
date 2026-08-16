"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Counter,
  Parallax,
  Reveal,
  SplitText,
  Stagger,
  StaggerItem,
  TiltCard,
  heroVariants,
} from "@/components/motion";
import { Marquee } from "@/components/marquee";
import { PhotoStack } from "@/components/photo-stack";
import { ProjectCard } from "@/components/project-card";
import { profile } from "@/data/profile";
import { marqueeSkills } from "@/data/skills";
import { stats } from "@/data/stats";
import { projects } from "@/data/projects";

const HeroScene = dynamic(() => import("@/components/scene-hero"), {
  ssr: false,
});

const focusAreas = [
  {
    title: "Computer Vision & ML",
    tag: "YOLO · OpenCV · Scikit-learn",
    description:
      "Custom object-detection pipelines, dataset curation, augmentation, and real-time vision that ships onto hardware.",
  },
  {
    title: "Full-Stack Development",
    tag: "React · Next.js · Node · SQL",
    description:
      "Algorithm-first platforms and database-backed web apps — from problem sets and submissions to recipes and ratings.",
  },
  {
    title: "Robotics & Hardware",
    tag: "Arduino · ESP32 · Sensors",
    description:
      "Bridging vision to actuation — cameras that see, microcontrollers that decide, and arms that move.",
  },
];

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 animate-drift rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-96 w-96 animate-drift rounded-full bg-accent-2/15 blur-3xl [animation-delay:-5s]" />
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
              className="font-display text-[clamp(3rem,9vw,6rem)] font-semibold leading-[0.95] tracking-tight text-ink"
            >
              {profile.name.split(" ")[0]}
              <br />
              <span className="italic text-accent">
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
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm text-paper transition-colors hover:bg-accent"
              >
                View my work
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-full border border-ink/20 px-7 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
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

      {/* ── Stats band ─────────────────────────── */}
      <section className="border-y border-line bg-cream-2/60">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 px-5 py-10 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div className="text-center sm:text-left">
                <p className="font-display text-4xl font-semibold tracking-tight text-ink">
                  <Counter
                    to={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={marqueeSkills} />

      {/* ── Featured projects ─────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-5 py-24">
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-sm text-accent">( Selected Work )</p>
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
      <section className="border-t border-line bg-cream-2/50">
        <div className="mx-auto w-full max-w-5xl px-5 py-24">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-accent">( Focus )</p>
            <h2 className="mb-12 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              What I do
            </h2>
          </Reveal>

          <Stagger className="grid gap-6 md:grid-cols-3">
            {focusAreas.map((area, i) => (
              <StaggerItem key={area.title}>
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-7 shadow-card transition-colors hover:border-accent/50">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {area.description}
                    </p>
                    <p className="mt-6 border-t border-line pt-4 font-mono text-xs text-accent-2">
                      {area.tag}
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── About preview ──────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-5 py-24">
        <div className="grid gap-10 sm:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-accent">( About )</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">
              Engineer. Builder.{" "}
              <span className="italic text-accent">Roboticist.</span>
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
          <div className="absolute left-1/4 top-0 h-72 w-72 animate-drift rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 animate-drift rounded-full bg-accent-2/15 blur-3xl [animation-delay:-8s]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center">
          <Reveal>
            <p className="mb-4 font-mono text-sm text-accent">( Contact )</p>
            <h2 className="mx-auto max-w-2xl font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Have an idea?{" "}
              <span className="italic text-accent">Let&apos;s build it.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Open to internships, robotics & vision work, and full-stack
              projects. Tell me what you&apos;re making.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-8 text-sm text-paper transition-colors hover:bg-accent"
              >
                Get in touch
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-12 items-center rounded-full border border-ink/20 px-8 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
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
